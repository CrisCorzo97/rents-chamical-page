'use client';
import { getCementeryRecords } from '@/app/(backoffice)/private/admin/cementery/actions.cementery';
import { CementeryRecordWithRelations } from '@/app/(backoffice)/private/admin/cementery/cementery.interface';
import { ReceiptForm } from '@/app/(backoffice)/private/admin/receipts/create-cementery-receipt/components/receiptForm';
import { SearchResultTable } from '@/app/(backoffice)/private/admin/receipts/create-cementery-receipt/components/searchResultTable';
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

function SearchCementery() {
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
              { taxpayer: { contains: search?.toUpperCase() ?? '' } },
              { deceased_name: { contains: search?.toUpperCase() ?? '' } },
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
              Ingresá tu nombre o el del difunto para buscar el registro.
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
export default SearchCementery;
