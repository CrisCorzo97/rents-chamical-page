'use client';

import { Button, Input, Label, Select } from '@/components/ui';
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
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toaster } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';
import { city_section, neighborhood, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { createProperty } from '../actions.property';

const formSchema = z.object({
  taxpayer: z.string(),
  taxpayer_type: z.nullable(z.string()),
  enrollment: z.nullable(z.string()),
  is_part: z.boolean(),
  address: z.string(),
  neighborhood: z.number(),
  city_section: z.number(),
  front_length: z.number(),
  last_year_paid: z.nullable(z.number()),
});

interface CreatePropertyRecordFormProps {
  neighborhoods: neighborhood[];
  citySections: city_section[];
}

export const CreatePropertyRecordForm = ({
  citySections,
  neighborhoods,
}: CreatePropertyRecordFormProps) => {
  const [isMutating, startTransition] = useTransition();
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const formObject = Object.fromEntries(formData.entries());

      const front_length = Number(
        (formObject.front_length as string).replace(',', '.')
      );

      const parsedData = {
        taxpayer: formObject.taxpayer as string,
        taxpayer_type: ['', 'none'].includes(formObject.taxpayer_type as string)
          ? null
          : (formObject.taxpayer_type as string),
        enrollment:
          (formObject.enrollment as string) === ''
            ? null
            : (formObject.enrollment as string),
        is_part: formObject.is_part === 'on',
        address: formObject.address as string,
        neighborhood: Number(formObject.neighborhood as string),
        city_section: Number(formObject.city_section as string),
        front_length,
        last_year_paid:
          (formObject.location_number as string) === ''
            ? null
            : Number(formObject.location_number as string),
      };

      try {
        formSchema.parse(parsedData);

        try {
          const missing_fields = [];

          if (!parsedData.enrollment) missing_fields.push('enrollment');

          const createData: Prisma.propertyCreateInput = {
            taxpayer: parsedData.taxpayer.toUpperCase(),
            taxpayer_type: parsedData.taxpayer_type,
            enrollment: parsedData.enrollment,
            is_part: parsedData.is_part,
            address: parsedData.address,
            neighborhood: {
              connect: { id: parsedData.neighborhood },
            },
            city_section: {
              connect: { id: parsedData.city_section },
            },
            front_length: parsedData.front_length,
            last_year_paid: parsedData.last_year_paid,
            missing_fields: !missing_fields.length
              ? null
              : JSON.stringify(missing_fields),
          };

          const { success, data, error } = await createProperty(createData);

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
            El registro de propiedad se ha creado correctamente.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Link href='/private/admin/property'>
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
            Datos del nuevo registro de inmueble
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
                <Label>Tipo de contribuyente</Label>
                <Select name='taxpayer_type'>
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccione un tipo' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key={1} value={'none'}>
                      Seleccione un tipo
                    </SelectItem>
                    <SelectItem key={2} value={'Persona física'}>
                      Persona física
                    </SelectItem>
                    <SelectItem key={3} value={'Persona jurídica'}>
                      Persona jurídica
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            <div className='flex gap-2 w-full'>
              <FormItem className='w-1/2'>
                <Label>Matrícula</Label>
                <Input name='enrollment' />
              </FormItem>
              <FormItem>
                <Label>¿Es parte?</Label>
                <Switch name='is_part' className='block' />
              </FormItem>
            </div>

            <div className='flex gap-2 w-full'>
              <FormItem className='flex-1'>
                <Label>
                  Dirección <span className='text-red-500'>*</span>
                </Label>
                <Input name='address' required />
              </FormItem>
              <FormItem className='w-1/3'>
                <Label>
                  Barrio <span className='text-red-500'>*</span>
                </Label>
                <Select name='neighborhood' required>
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
                <Select name='city_section' required>
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
                <Label>
                  Mts de frente <span className='text-red-500'>*</span>
                </Label>
                <Input type='text' name='front_length' required />
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
