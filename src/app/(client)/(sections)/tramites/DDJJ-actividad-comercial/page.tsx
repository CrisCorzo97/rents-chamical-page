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
      period: '2024-09',
      grossAmount: 12000,
      status: 'approved',
      dueDate: '2024-10-20',
      submissionDate: '2024-10-18',
    },
    {
      id: '2',
      period: '2024-10',
      grossAmount: 15000,
      status: 'rejected',
      dueDate: '2024-11-20',
      submissionDate: '2024-11-18',
    },
    {
      id: '3',
      period: '2024-11',
      grossAmount: 0,
      status: 'payment_review',
      dueDate: '2024-12-20',
      submissionDate: '2024-12-18',
    },
    {
      id: '4',
      period: '2024-12',
      grossAmount: 0,
      status: 'payment_pending',
      dueDate: '2025-01-20',
      submissionDate: '2025-01-18',
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
                Nueva Declaración
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

            <Tabs defaultValue='payment_pending' className='w-full'>
              <TabsList>
                <TabsTrigger value='payment_pending'>Pendientes</TabsTrigger>
                <TabsTrigger value='payment_review'>En revisión</TabsTrigger>
                <TabsTrigger value='finished'>Finalizados</TabsTrigger>
              </TabsList>
              <TabsContent value='payment_pending'>
                <DeclarationsList
                  declarations={declarations.filter(
                    (d) => d.status === 'payment_pending'
                  )}
                  onUploadProof={setSelectedDeclaration}
                />
              </TabsContent>
              <TabsContent value='payment_review'>
                <DeclarationsList
                  declarations={declarations.filter(
                    (d) => d.status === 'payment_review'
                  )}
                  onUploadProof={setSelectedDeclaration}
                />
              </TabsContent>
              <TabsContent value='finished'>
                <DeclarationsList
                  declarations={declarations.filter((d) =>
                    ['approved', 'rejected'].includes(d.status)
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
