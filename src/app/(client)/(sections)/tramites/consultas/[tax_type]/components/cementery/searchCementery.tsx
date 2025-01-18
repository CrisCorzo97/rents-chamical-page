'use client';
import { getCementeryRecords } from '@/app/(backoffice)/private/admin/cementery/actions.cementery';
import { CementeryRecordWithRelations } from '@/app/(backoffice)/private/admin/cementery/cementery.interface';
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
import { CementeryResultTable } from './cementeryResultTable';
import ShowCementeryData from './showCementeryData';

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
    <article className='mt-5 w-full flex items-start justify-between gap-3'>
      <section className='w-full max-w-3xl flex flex-col gap-3'>
        <Toaster />
        <Card className='-mt-3 w-full'>
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

        <CementeryResultTable
          data={searchResult}
          onSelect={(rec) => {
            if (rec.id !== selectedRecord?.id) {
              setSelectedRecord(rec);
            } else {
              setSelectedRecord(null);
            }
          }}
        />
      </section>

      <ShowCementeryData record={selectedRecord} />
    </article>
  );
}
export default SearchCementery;
