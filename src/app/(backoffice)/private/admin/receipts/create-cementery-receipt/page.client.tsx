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
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { getCementeryRecords } from '../../actions';
import { CementeryRecordWithRelations } from '../../cementery/cementery.interface';
import { ReceiptForm } from './components/receiptForm';
import { SearchResultTable } from './components/searchResultTable';

export const GenerateCementeryReceiptPageClient = () => {
  const [searchResult, setSearchResult] = useState<
    CementeryRecordWithRelations[]
  >([]);
  const [selectedRecord, setSelectedRecord] =
    useState<CementeryRecordWithRelations | null>(null);
  const [isSearching, startSearchTransition] = useTransition();

  const handleSearch = (formData: FormData) => {
    startSearchTransition(async () => {
      setSelectedRecord(null);
      const search = formData.get('search') as string;

      try {
        const cementeryRecords = await getCementeryRecords({
          limit: 50,
          filter: {
            OR: [
              { taxpayer: { contains: search } },
              { deceased_name: { contains: search } },
            ],
          },
        });

        if (!cementeryRecords.data?.length) {
          toast.error(
            'No se encontraron registros. Intente nuevamente o agregue un nuevo registro.',
            { duration: 5000 }
          );
        }

        setSearchResult(cementeryRecords.data ?? []);
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <>
      <Toaster />
      <section className='flex gap-3'>
        <Card className='mt-6 w-full max-w-3xl'>
          <CardHeader>
            <CardTitle>Buscar registro de Cementerio</CardTitle>
            <CardDescription>
              Ingrese el nombre del contribuyente o del difunto para buscar el
              registro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSearch} className='flex gap-3'>
              <FormItem className='w-full'>
                <Label>Apellido y Nombre</Label>
                <Input
                  type='text'
                  name='search'
                  placeholder='Jose Perez'
                  required
                />
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
            <Button
              variant='outline'
              // Agregar redirección a la página de creación de registro
              className='flex gap-3 transition-all'
            >
              <FilePlus2 size={20} />
              Crear nuevo registro
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className='mt-6 max-w-3xl scroll-smooth'>
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
