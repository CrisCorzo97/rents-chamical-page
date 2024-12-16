'use client';

import {
  Button,
  Calendar,
  Input,
  Label,
  Popover,
  Select,
} from '@/components/ui';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormItem } from '@/components/ui/form';
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/cn';
import { formatCuilInput } from '@/lib/formatters';
import {
  city_section,
  commercial_activity,
  neighborhood,
  Prisma,
} from '@prisma/client';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { createCommercialEnablement } from '../actions.commercial_enablement';

const formSchema = z.object({
  taxpayer: z.string(),
  tax_id: z.string(),
  company_name: z.string(),
  commercial_activity_id: z.number(),
  second_commercial_activity_id: z.nullable(z.number()),
  third_commercial_activity_id: z.nullable(z.number()),
  address: z.string(),
  address_number: z.nullable(z.number()),
  neighborhood_id: z.number(),
  city_section_id: z.number(),
  block: z.nullable(z.string()),
  parcel: z.nullable(z.string()),
  registration_date: z.string().datetime(),
  cancellation_date: z.nullable(z.string().datetime()),
  registration_receipt: z.string(),
  cancellation_receipt: z.nullable(z.string()),
  gross_income_rate: z.nullable(z.string()),
  last_year_paid: z.nullable(z.number()),
});

interface CreateCommercialEnablementFormProps {
  neighborhoods: neighborhood[];
  citySections: city_section[];
  commercialActivities: commercial_activity[];
}

export const CreateCommercialEnablementForm = ({
  citySections,
  neighborhoods,
  commercialActivities,
}: CreateCommercialEnablementFormProps) => {
  const [taxId, setTaxId] = useState<string>('');
  const [{ registration_date, cancellation_date }, setDates] = useState<{
    registration_date: Dayjs;
    cancellation_date: Dayjs | undefined;
  }>({
    registration_date: dayjs(),
    cancellation_date: undefined,
  });
  const [grossIncomeRate, setGrossIncomeRate] = useState<string>('');
  const [isMutating, startTransition] = useTransition();
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const formObject = Object.fromEntries(formData.entries());

      const parsedData = {
        taxpayer: formObject.taxpayer as string,
        tax_id: formObject.tax_id as string,
        company_name: formObject.company_name as string,
        commercial_activity_id: Number(
          formObject.commercial_activity_id as string
        ),
        second_commercial_activity_id: formObject.second_commercial_activity_id
          ? Number(formObject.second_commercial_activity_id as string)
          : null,
        third_commercial_activity_id: formObject.third_commercial_activity_id
          ? Number(formObject.third_commercial_activity_id as string)
          : null,
        address: formObject.address as string,
        address_number: formObject.address_number
          ? Number(formObject.address_number)
          : null,
        neighborhood_id: Number(formObject.neighborhood_id as string),
        city_section_id: Number(formObject.city_section_id as string),
        block: formObject.block ? (formObject.block as string) : null,
        parcel: formObject.parcel ? (formObject.parcel as string) : null,
        registration_date: registration_date.toISOString(),
        cancellation_date: cancellation_date?.toISOString() ?? null,
        registration_receipt: formObject.registration_receipt as string,
        cancellation_receipt: formObject.cancellation_receipt
          ? (formObject.cancellation_receipt as string)
          : null,
        gross_income_rate: formObject.gross_income_rate
          ? (formObject.gross_income_rate as string)
          : null,
        last_year_paid: formObject.last_year_paid
          ? Number(formObject.last_year_paid as string)
          : null,
      };

      try {
        formSchema.parse(parsedData);

        try {
          const createData: Prisma.commercial_enablementCreateInput = {
            taxpayer: parsedData.taxpayer.toUpperCase(),
            tax_id: parsedData.tax_id,
            company_name: parsedData.company_name.toUpperCase(),
            commercial_activity: {
              connect: { id: parsedData.commercial_activity_id },
            },
            commercial_activity_commercial_enablement_second_commercial_activity_idTocommercial_activity:
              parsedData.second_commercial_activity_id
                ? {
                    connect: { id: parsedData.second_commercial_activity_id },
                  }
                : undefined,
            commercial_activity_commercial_enablement_third_commercial_activity_idTocommercial_activity:
              parsedData.third_commercial_activity_id
                ? {
                    connect: { id: parsedData.third_commercial_activity_id },
                  }
                : undefined,
            address: parsedData.address,
            address_number: parsedData.address_number,
            neighborhood: {
              connect: { id: parsedData.neighborhood_id },
            },
            city_section: {
              connect: { id: parsedData.city_section_id },
            },
            block: parsedData.block,
            parcel: parsedData.parcel,
            registration_date: parsedData.registration_date,
            cancellation_date: parsedData.cancellation_date,
            registration_receipt: parsedData.registration_receipt,
            cancellation_receipt: parsedData.cancellation_receipt,
            gross_income_rate: parsedData.gross_income_rate,
            last_year_paid: parsedData.last_year_paid,
          };

          const { success, data, error } = await createCommercialEnablement(
            createData
          );

          if (!success || !data) {
            throw new Error(error ?? '');
          }

          setOpenSuccess(true);
        } catch (error) {
          console.error(error);

          toast.error(
            'Error al crear el registro de propiedad. Revise los datos ingresados e intente nuevamente.',
            {
              duration: 5000,
            }
          );
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <section>
      <Toaster />

      <AlertDialog open={openSuccess}>
        <AlertDialogContent>
          <AlertDialogTitle>Registro creado</AlertDialogTitle>
          <AlertDialogDescription>
            El registro de habilitación comercial se ha creado correctamente.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Link href='/private/admin/commercial_enablement'>
                <Button onClick={() => setOpenSuccess(false)}>Finalizar</Button>
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className='w-full max-w-3xl mt-6'>
        <CardHeader>
          <CardTitle>Nuevo registro</CardTitle>
          <CardDescription>
            Datos del nuevo registro de habilitación comercial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className='w-full flex flex-col gap-3'>
            <div className='flex gap-2 w-full'>
              <FormItem className='flex-1'>
                <Label>
                  Contribuyente <span className='text-red-500'>*</span>
                </Label>
                <Input name='taxpayer' required />
              </FormItem>
              <FormItem className='w-1/3'>
                <Label>
                  CUIT <span className='text-red-500'>*</span>
                </Label>
                <Input
                  name='tax_id'
                  required
                  value={taxId}
                  onChange={(e) => setTaxId(formatCuilInput(e.target.value))}
                />
              </FormItem>
            </div>

            <div className='flex gap-2 w-full'>
              <FormItem className='flex-1'>
                <Label>
                  Razón social <span className='text-red-500'>*</span>
                </Label>
                <Input name='company_name' required />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>
                  Actividad o rubro principal{' '}
                  <span className='text-red-500'>*</span>
                </Label>
                <Select
                  name='commercial_activity_id'
                  required
                  onValueChange={(value) => {
                    const foundAct = commercialActivities.find(
                      (act) => Number(act.id) === Number(value)
                    );
                    const aliquot = foundAct?.aliquot ?? 0;

                    setGrossIncomeRate(aliquot.toString());
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccione un rubro' />
                  </SelectTrigger>
                  <SelectContent>
                    {commercialActivities.map((commercial_act) => (
                      <SelectItem
                        key={commercial_act.id}
                        value={`${commercial_act.id}`}
                      >
                        {commercial_act.activity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            <div className='flex gap-2 w-full'>
              <FormItem className='flex-1'>
                <Label>Actividad o rubro secundario</Label>
                <Select
                  name='second_commercial_activity_id'
                  onValueChange={(value) => {
                    const foundAct = commercialActivities.find(
                      (act) => Number(act.id) === Number(value)
                    );
                    const aliquot = Math.max(
                      foundAct?.aliquot ?? 0,
                      Number(grossIncomeRate)
                    );

                    setGrossIncomeRate(aliquot.toString());
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccione un rubro' />
                  </SelectTrigger>
                  <SelectContent>
                    {commercialActivities.map((commercial_act) => (
                      <SelectItem
                        key={commercial_act.id}
                        value={`${commercial_act.id}`}
                      >
                        {commercial_act.activity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Actividad o rubro terciario</Label>
                <Select
                  name='third_commercial_activity_id'
                  onValueChange={(value) => {
                    const foundAct = commercialActivities.find(
                      (act) => Number(act.id) === Number(value)
                    );
                    const aliquot = Math.max(
                      foundAct?.aliquot ?? 0,
                      Number(grossIncomeRate)
                    );

                    setGrossIncomeRate(aliquot.toString());
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccione un rubro' />
                  </SelectTrigger>
                  <SelectContent>
                    {commercialActivities.map((commercial_act) => (
                      <SelectItem
                        key={commercial_act.id}
                        value={`${commercial_act.id}`}
                      >
                        {commercial_act.activity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            <div className='flex gap-2 w-full'>
              <FormItem className='flex-1'>
                <Label>
                  Dirección <span className='text-red-500'>*</span>
                </Label>
                <Input name='address' required />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Nro</Label>
                <Input type='number' name='address_number' min={0} />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>
                  Barrio <span className='text-red-500'>*</span>
                </Label>
                <Select name='neighborhood_id' required>
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccione un barrio' />
                  </SelectTrigger>
                  <SelectContent>
                    {neighborhoods.map((neighborhood) => (
                      <SelectItem
                        key={neighborhood.id}
                        value={`${neighborhood.id}`}
                      >
                        {neighborhood.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            <div className='flex gap-2 w-full'>
              <FormItem className='flex-1'>
                <Label>
                  Sección <span className='text-red-500'>*</span>
                </Label>
                <Select name='city_section_id' required>
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccione una sección' />
                  </SelectTrigger>
                  <SelectContent>
                    {citySections.map((section) => (
                      <SelectItem key={section.id} value={`${section.id}`}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Manzana</Label>
                <Input name='block' />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Parcela</Label>
                <Input name='parcel' />
              </FormItem>
            </div>

            <div className='flex gap-2 w-full'>
              <FormItem className='flex-1'>
                <Label>
                  Fecha de alta <span className='text-red-500'>*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[280px] justify-start text-left font-normal',
                        !registration_date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {registration_date ? (
                        dayjs(registration_date).format('DD/MM/YYYY')
                      ) : (
                        <span>Seleccione una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={dayjs(registration_date).toDate()}
                      onSelect={(date) =>
                        setDates({
                          registration_date: dayjs(date),
                          cancellation_date,
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Fecha de baja</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[280px] justify-start text-left font-normal',
                        !cancellation_date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {cancellation_date ? (
                        dayjs(cancellation_date).format('DD/MM/YYYY')
                      ) : (
                        <span>Seleccione una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={dayjs(cancellation_date).toDate()}
                      onSelect={(date) =>
                        setDates({
                          cancellation_date: dayjs(date),
                          registration_date,
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            </div>

            <div className='flex gap-2 w-full'>
              <FormItem className='flex-1'>
                <Label>
                  Nro de comprobante de alta{' '}
                  <span className='text-red-500'>*</span>
                </Label>
                <Input name='registration_receipt' required />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Nro de comprobante de baja</Label>
                <Input name='cancellation_receipt' />
              </FormItem>
            </div>

            <div className='flex gap-2 w-full'>
              <FormItem className='flex-1'>
                <Label>Alícuota de IIBB</Label>
                <Input
                  name='gross_income_rate'
                  defaultValue={grossIncomeRate}
                />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Último año pagado</Label>
                <Input
                  type='number'
                  name='last_year_paid'
                  max={dayjs().year()}
                />
              </FormItem>
            </div>

            <div className='w-full justify-end flex mt-6'>
              <FormItem>
                <Button type='submit' loading={isMutating}>
                  Crear
                </Button>
              </FormItem>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};
