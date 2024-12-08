'use client';

import { Button, Input, Label } from '@/components/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormItem } from '@/components/ui/form';
import { Toaster } from '@/components/ui/sonner';
import { FilePlus2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { getComercialEnablements } from '../../commercial_enablement/actions.commercial_enablement';
import { CommercialEnablementWithRelations } from '../../commercial_enablement/commercial_enablement.interface';
import { ReceiptForm } from './components/receiptForm';
import { SearchResultTable } from './components/searchResultTable';

export const GenerateCommercialEnablementReceiptClient = () => {
  const [searchResult, setSearchResult] = useState<
    CommercialEnablementWithRelations[]
  >([]);
  const [selectedRecord, setSelectedRecord] =
    useState<CommercialEnablementWithRelations | null>(null);
  const [isSearching, startSearchTransition] = useTransition();

  const handleSearch = (formData: FormData) => {
    startSearchTransition(async () => {
      setSelectedRecord(null);
      const search = formData.get('search') as string;

      try {
        const commercialEnablement = await getComercialEnablements({
          limit: 50,
          filter: {
            OR: [
              { taxpayer: { contains: search?.toUpperCase() ?? '' } },
              { company_name: { contains: search?.toUpperCase() ?? '' } },
            ],
          },
        });

        if (!commercialEnablement.data?.length) {
          toast.error(
            'No se encontraron registros. Intente nuevamente o agregue un nuevo registro.',
            { duration: 5000 }
          );
        }

        setSearchResult(commercialEnablement.data ?? []);
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <>
      <Toaster />
      <section className='flex gap-3'>
        <Card className='mt-6 w-full max-w-4xl'>
          <CardHeader>
            <CardTitle>Buscar registro de habilitación comercial</CardTitle>
            <CardDescription>
              Ingrese el nombre del contribuyente o razón social para buscar el
              registro de la habilitación comercial.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSearch} className='flex gap-3'>
              <FormItem className='w-full'>
                <Label>Apellido y Nombre</Label>
                <Input type='text' name='search' required />
              </FormItem>

              <FormItem className='mt-3 self-end'>
                <Button
                  type='submit'
                  loading={isSearching}
                  className='flex gap-2 transition-all'
                >
                  Buscar
                </Button>
              </FormItem>
            </form>
          </CardContent>
        </Card>

        <Card className='mt-6 w-full max-w-xs  bg-blue-100 border-blue-500'>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
            <CardDescription>
              Si no se encuentra cargado el registro en el sistema, puede
              agregar un nuevo registro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/private/admin/commercial_enablement/create`}>
              <Button variant='outline' className='flex gap-3 transition-all'>
                <FilePlus2 size={20} />
                Crear nuevo registro
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className='mt-6 max-w-4xl scroll-smooth'>
        <SearchResultTable
          data={searchResult}
          onSelect={(record) => {
            setSelectedRecord(record);
          }}
        />
      </section>

      <ReceiptForm record={selectedRecord} />
    </>
  );
};
