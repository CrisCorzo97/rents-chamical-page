'use client';
import { getProperties } from '@/app/(backoffice)/private/admin/property/actions.property';
import { PropertyRecordWithRelations } from '@/app/(backoffice)/private/admin/property/property.interface';
import { ReceiptForm } from '@/app/(backoffice)/private/admin/receipts/create-property-receipt/components/receiptForm';
import { SearchResultTable } from '@/app/(backoffice)/private/admin/receipts/create-property-receipt/components/searchResultTable';
import { Button, Input, Label } from '@/components/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormItem } from '@/components/ui/form';
import { useState, useTransition } from 'react';
import { toast, Toaster } from 'sonner';

function SearchPoperty() {
  const [searchResult, setSearchResult] = useState<
    PropertyRecordWithRelations[]
  >([]);
  const [selectedRecord, setSelectedRecord] =
    useState<PropertyRecordWithRelations | null>(null);
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
              { enrollment: { contains: search?.toUpperCase() ?? '' } },
              { taxpayer: { contains: search?.toUpperCase() ?? '' } },
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
        <Card className='mt-6 w-full max-w-3xl'>
          <CardHeader>
            <CardTitle>Buscar registro de Inmueble</CardTitle>
            <CardDescription>
              Ingresá tu nombre o tu matrícula catastral para buscar el
              registro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSearch} className='flex gap-3'>
              <FormItem className='w-full'>
                <Label>Apellido y Nombre o Matrícula</Label>
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
}
export default SearchPoperty;
