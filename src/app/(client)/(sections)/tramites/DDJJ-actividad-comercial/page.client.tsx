'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText } from 'lucide-react';
import DeclarationForm from './components/declaration-form';
import PaymentProofForm from './components/payment-proof-form';
import UpcomingDueDates from './components/upcoming-due-dates';
import DeclarationsList from './components/declaration-list';
import { Card, CardContent } from '@/components/ui';
import { PeriodData } from '../lib';
import { affidavit, Prisma } from '@prisma/client';

interface CommercialActivityAffidavitClientProps {
  upcomingDueDatesPeriods: PeriodData[];
  declarations: affidavit[];
}

export function CommercialActivityAffidavitClient({
  upcomingDueDatesPeriods,
  declarations,
}: CommercialActivityAffidavitClientProps) {
  const [showDeclarationForm, setShowDeclarationForm] = useState(false);
  const [selectedDeclaration, setSelectedDeclaration] = useState<
    affidavit | Prisma.affidavitCreateInput | null
  >(null);

  const handleDeclarationSubmit = (
    declaration: Prisma.affidavitCreateInput
  ) => {
    setSelectedDeclaration(declaration);
    setShowDeclarationForm(false);
  };

  const handlePaymentProofSubmit = (
    updatedDeclaration: Prisma.affidavitUpdateInput
  ) => {
    setSelectedDeclaration(null);
  };

  return (
    <>
      <Card>
        <CardContent className='p-4'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-2'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center'>
                <FileText className='h-8 w-8 text-primary mr-2' />
                <h1 className='text-2xl font-bold text-gray-900'>
                  Portal Contribuyente
                </h1>
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
            <UpcomingDueDates
              upcomingDueDatePeriods={upcomingDueDatesPeriods}
            />

            <Tabs defaultValue='pending_payment' className='w-full'>
              <TabsList>
                <TabsTrigger value='pending_payment'>Pendientes</TabsTrigger>
                <TabsTrigger value='under_review'>En revisión</TabsTrigger>
                <TabsTrigger value='finished'>Finalizados</TabsTrigger>
              </TabsList>
              <TabsContent value='pending_payment'>
                <DeclarationsList
                  declarations={declarations.filter(
                    (d) => d.status === 'pending_payment'
                  )}
                  onUploadProof={setSelectedDeclaration}
                />
              </TabsContent>
              <TabsContent value='under_review'>
                <DeclarationsList
                  declarations={declarations.filter(
                    (d) => d.status === 'under_review'
                  )}
                  onUploadProof={setSelectedDeclaration}
                />
              </TabsContent>
              <TabsContent value='finished'>
                <DeclarationsList
                  declarations={declarations.filter((d) =>
                    ['approved', 'refused'].includes(d.status)
                  )}
                  onUploadProof={setSelectedDeclaration}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </>
  );
}
