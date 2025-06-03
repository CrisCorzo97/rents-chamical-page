'use client';
import { getProperties } from '@/app/(backoffice)/private/admin/property/actions.property';
import { PropertyRecordWithRelations } from '@/app/(backoffice)/private/admin/property/property.interface';
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
import PropertyResultTable from './propertyResultTable';
import ShowPropertyData from './showPropertyData';

const SearchPoperty = () => {
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
          filters: {
            enrollment: search,
          },
        });

        if (!properties.data?.length) {
          toast.error(
            'No se encontraron registros. Por favor revise los datos ingresados e intente nuevamente.',
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
    <article className='mt-5 w-full flex items-start justify-between gap-3'>
      <section className='w-full max-w-3xl flex flex-col gap-3'>
        <Toaster />
        <Card className='-mt-3 w-full'>
          <CardHeader>
            <CardTitle>Buscar registro de Inmueble</CardTitle>
            <CardDescription>
              Ingrese su matrícula para buscar el registro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSearch} className='flex gap-3'>
              <FormItem className='w-full'>
                <Label>Matrícula</Label>
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

        <PropertyResultTable
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

      <ShowPropertyData record={selectedRecord} />
    </article>
  );
};
export default SearchPoperty;
