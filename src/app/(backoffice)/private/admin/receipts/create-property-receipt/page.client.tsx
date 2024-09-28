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
import { property } from '@prisma/client';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FilePlus2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { getProperties } from '../../actions';
import { PropertyRecordWithRelations } from '../../property/property.interface';
import { ReceiptForm } from './components/receiptForm';
import { SearchResultTable } from './components/searchResultTable';

dayjs.extend(customParseFormat);

export const GeneratePropertyReceiptClientPage = () => {
  const [searchResult, setSearchResult] = useState<
    PropertyRecordWithRelations[]
  >([]);
  const [selectedRecord, setSelectedRecord] = useState<property | null>(null);
  const [isSearching, startSearchTransition] = useTransition();

  const handleSearch = (formData: FormData) => {
    startSearchTransition(async () => {
      setSelectedRecord(null);
      const search = formData.get('search') as string;

      try {
        const properties = await getProperties({
          limit: 50,
          filter: {
            OR: [
              { enrollment: { contains: search } },
              { taxpayer: { contains: search } },
            ],
          },
        });

        if (!properties.data?.length) {
          toast.error(
            'No se encontraron registros. Intente nuevamente o agregue un nuevo registro.',
            { duration: 5000 }
          );
        }

        setSearchResult(properties.data ?? []);
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <>
      <Toaster />
      <section className='flex gap-3'>
        <Card className='mt-6 w-full max-w-3xl min-w-80'>
          <CardHeader>
            <CardTitle>Buscar registro de Inmueble</CardTitle>
            <CardDescription>
              Ingrese un nombre o matrícula para buscar el registro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSearch} className='flex gap-3'>
              <FormItem className='w-full'>
                <Label>Nombre o matrícula</Label>
                <Input
                  type='text'
                  name='search'
                  placeholder='3771-836-1948'
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
