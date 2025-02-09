'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText } from 'lucide-react';
import { Declaration } from './types';
import DeclarationForm from './components/declaration-form';
import PaymentProofForm from './components/payment-proof-form';
import UpcomingDueDates from './components/upcoming-due-dates';
import DeclarationsList from './components/declaration-list';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';

export default function Home() {
  const [showDeclarationForm, setShowDeclarationForm] = useState(false);
  const [selectedDeclaration, setSelectedDeclaration] =
    useState<Declaration | null>(null);
  const [declarations, setDeclarations] = useState<Declaration[]>([
    {
      id: '1',
      period: '2024-01',
      grossAmount: 0,
      status: 'pending',
      dueDate: '2024-03-15',
    },
    {
      id: '2',
      period: '2023-12',
      grossAmount: 15000,
      status: 'submitted',
      dueDate: '2024-02-15',
      submissionDate: '2024-02-10',
    },
  ]);

  const handleDeclarationSubmit = (declaration: Declaration) => {
    setDeclarations([...declarations, declaration]);
    setSelectedDeclaration(declaration);
    setShowDeclarationForm(false);
  };

  const handlePaymentProofSubmit = (updatedDeclaration: Declaration) => {
    setDeclarations(
      declarations.map((d) =>
        d.id === updatedDeclaration.id ? updatedDeclaration : d
      )
    );
    setSelectedDeclaration(null);
  };

  return (
    <section className='text-lg max-w-6xl mx-auto mb-8'>
      <Breadcrumb className='max-w-6xl mx-auto h-20'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/' prefetch>
                Inicio
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/tramites' prefetch>
                Trámites
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>DDJJ Actividad Comercial</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardContent className='p-4'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-2'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center'>
                <FileText className='h-8 w-8 text-primary mr-2' />
                <h1 className='text-2xl font-bold text-gray-900'>TaxPortal</h1>
              </div>
              <Button onClick={() => setShowDeclarationForm(true)}>
                New Declaration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <main className='max-w-7xl mx-auto mt-8'>
        {showDeclarationForm ? (
          <DeclarationForm
            onSubmit={handleDeclarationSubmit}
            onCancel={() => setShowDeclarationForm(false)}
          />
        ) : selectedDeclaration ? (
          <PaymentProofForm
            declaration={selectedDeclaration}
            onSubmit={handlePaymentProofSubmit}
            onCancel={() => setSelectedDeclaration(null)}
          />
        ) : (
          <div className='grid gap-6'>
            <UpcomingDueDates declarations={declarations} />

            <Tabs defaultValue='pending' className='w-full'>
              <TabsList>
                <TabsTrigger value='pending'>Pending</TabsTrigger>
                <TabsTrigger value='submitted'>Submitted</TabsTrigger>
              </TabsList>
              <TabsContent value='pending'>
                <DeclarationsList
                  declarations={declarations.filter(
                    (d) => d.status === 'pending'
                  )}
                  onUploadProof={setSelectedDeclaration}
                />
              </TabsContent>
              <TabsContent value='submitted'>
                <DeclarationsList
                  declarations={declarations.filter(
                    (d) => d.status === 'submitted'
                  )}
                  onUploadProof={setSelectedDeclaration}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </section>
  );
}
