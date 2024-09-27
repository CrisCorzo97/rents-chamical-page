'use client';

import { Button, Input, Label } from '@/components/ui';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormItem } from '@/components/ui/form';
import { Toaster } from '@/components/ui/sonner';
import { formatCurrency } from '@/lib/formatters';
import { property } from '@prisma/client';
import { PDFViewer } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { getProperties } from '../../actions';
import { PropertyRecordWithRelations } from '../../property/property.interface';
import { ReceiptPFD } from './receiptPFD';
import { SearchResultTable } from './searchResultTable';

dayjs.extend(customParseFormat);

export const ReceiptForm = () => {
  const [searchResult, setSearchResult] = useState<
    PropertyRecordWithRelations[]
  >([]);
  const [selectedRecord, setSelectedRecord] = useState<property | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isSearching, startSearchTransition] = useTransition();
  const [isMutating, startMutatingTransition] = useTransition();

  const handleSearch = (formData: FormData) => {
    startSearchTransition(async () => {
      setSelectedRecord(null);
      const search = formData.get('search') as string;

      try {
        const properties = await getProperties({
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

  const handleSubmit = (formData: FormData) => {
    startMutatingTransition(async () => {});
  };

  return (
    <>
      <section>
        <Toaster />
        <Card className='mt-6 max-w-3xl'>
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
      </section>

      <section className='mt-6 max-w-3xl'>
        <SearchResultTable
          data={searchResult}
          onSelect={(record) => {
            setSelectedRecord(record);
          }}
        />
      </section>

      <CardResult record={selectedRecord} onSubmit={handleSubmit} />
    </>
  );
};

interface CardResultProps {
  record: property | null;
  onSubmit: (data: FormData) => void;
}

const CardResult = ({ record, onSubmit }: CardResultProps) => {
  const [amountValue, setAmountValue] = useState<string>('');

  return (
    <section>
      {record ? (
        <Card className='mt-6 max-w-3xl'>
          <CardHeader>
            <CardTitle>Comprobante de Inmueble</CardTitle>
            <CardDescription>
              Revise que todos los datos del comprobante sean correctos antes de
              generar el comprobante.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={onSubmit} className='w-full flex flex-col gap-3'>
              <div className='w-full flex flex-wrap gap-3'>
                <FormItem className='flex-none'>
                  <Label>Fecha del comprobante</Label>
                  <Input
                    type='text'
                    name='created_at'
                    value={dayjs().format('DD/MM/YYYY')}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Matrícula</Label>
                  <Input
                    type='text'
                    name='enrollment'
                    value={record.enrollment ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Es parte</Label>
                  <Input
                    type='text'
                    name='is_part'
                    value={record.is_part ? 'Sí' : 'No'}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
              </div>

              <div className='w-full flex gap-3'>
                <FormItem className='flex-1'>
                  <Label>Apellido y nombre del contribuyente</Label>
                  <Input
                    type='text'
                    name='taxpayer'
                    value={record.taxpayer}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Tipo de contribuyente</Label>
                  <Input
                    type='text'
                    name='taxpayer_type'
                    value={record.taxpayer_type ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
              </div>

              <div className='w-full flex gap-3'>
                <FormItem className='flex-1'>
                  <Label>Dirección</Label>
                  <Input
                    type='text'
                    name='address'
                    value={record.address ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-none'>
                  <Label>Barrio</Label>
                  <Input
                    type='text'
                    name='id_neighborhood'
                    value={'Centro'}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-none'>
                  <Label>Sección</Label>
                  <Input
                    type='text'
                    name='id_city_section'
                    value={'A2'}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
              </div>

              <div className='w-full flex gap-3'>
                <FormItem className='flex-1'>
                  <Label>Mts frente</Label>
                  <Input
                    type='text'
                    name='front_length'
                    value={record.front_length ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Último año pagado</Label>
                  <Input
                    type='text'
                    name='last_year_paid'
                    value={Number(record.last_year_paid) ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
              </div>

              <div className='w-full flex gap-3'>
                <FormItem className='flex-1'>
                  <Label>Observaciones</Label>
                  <Input
                    type='text'
                    name='observations'
                    placeholder='Tenía saldo a favor...'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Importe</Label>
                  <Input
                    type='text'
                    name='amount'
                    placeholder='$ 1.000'
                    className='flex-1'
                    value={amountValue}
                    onChange={(e) =>
                      setAmountValue(formatCurrency(e.target.value))
                    }
                  />
                </FormItem>
              </div>

              <div className='mt-6 flex gap-3 self-end'>
                <FormItem>
                  <Button variant='secondary'>Editar</Button>
                </FormItem>
                <FormItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type='submit' className='hover:bg-opacity-50'>
                        Generar comprobante
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className='flex flex-col min-h-[90vh] min-w-screen max-w-screen-2xl'>
                      <PDFViewer className='flex-1 h-[95%] w-[95%] m-auto'>
                        <ReceiptPFD />
                      </PDFViewer>
                      <AlertDialogFooter className='flex-none'>
                        <AlertDialogAction>Continuar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </FormItem>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <></>
      )}
    </section>
  );
};
