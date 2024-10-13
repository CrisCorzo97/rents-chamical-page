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
import {
  burial_type,
  cementery_place,
  neighborhood,
  Prisma,
} from '@prisma/client';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { createCementeryRecord } from '../actions.cementery';

// esquema de validación de formulario basado en los name del formulario
const formSchema = z.object({
  taxpayer: z.string(),
  deceased_name: z.nullable(z.string()),
  address_taxpayer: z.string(),
  id_neighborhood: z.number(),
  id_cementery_place: z.number(),
  id_burial_type: z.number(),
  section: z.nullable(z.string()),
  row: z.nullable(z.number()),
  location_number: z.nullable(z.number()),
});

interface CreateCementeryRecordFormProps {
  neighborhoods: neighborhood[];
  burialTypes: burial_type[];
  cementeryPlaces: cementery_place[];
}

export const CreateCementeryRecordForm = ({
  neighborhoods,
  burialTypes,
  cementeryPlaces,
}: CreateCementeryRecordFormProps) => {
  const [isMutating, startTransition] = useTransition();
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const formObject = Object.fromEntries(formData.entries());

      const parsedData = {
        taxpayer: formObject.taxpayer as string,
        deceased_name: formObject.deceased_name
          ? (formObject.deceased_name as string)
          : null,
        address_taxpayer: formObject.address_taxpayer as string,
        id_neighborhood: Number(formObject.id_neighborhood),
        id_cementery_place: Number(formObject.id_cementery_place),
        id_burial_type: Number(formObject.id_burial_type),
        section: formObject.section ? (formObject.section as string) : null,
        row: formObject.row ? Number(formObject.row) : null,
        location_number: formObject.location_number
          ? Number(formObject.location_number)
          : null,
      };

      try {
        formSchema.parse(parsedData);

        try {
          const createData: Prisma.cementeryCreateInput = {
            taxpayer: parsedData.taxpayer,
            deceased_name: parsedData.deceased_name,
            address_taxpayer: parsedData.address_taxpayer,
            neighborhood: {
              connect: {
                id: parsedData.id_neighborhood,
              },
            },
            cementery_place: {
              connect: {
                id: parsedData.id_cementery_place,
              },
            },
            burial_type: {
              connect: {
                id: parsedData.id_burial_type,
              },
            },
            section: parsedData.section,
            row: parsedData.row,
            location_number: parsedData.location_number,
          };

          const { success, data, error } = await createCementeryRecord(
            createData
          );

          if (!success || !data) {
            throw new Error(error ?? '');
          }
          setOpenSuccess(true);
        } catch (error) {
          console.error(error);

          toast.error(
            'Error al crear el registro de cementerio. Revise los datos ingresados e intente nuevamente.',
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
            El registro de cementerio se ha creado correctamente.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Link href='/private/admin/cementery'>
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
            Datos del nuevo registro de cementerio
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
              <FormItem className='flex-1'>
                <Label>Nombre del difunto</Label>
                <Input name='deceased_name' />
              </FormItem>
            </div>

            <div className='flex gap-2 w-full'>
              <FormItem className='flex-1'>
                <Label>
                  Dirección <span className='text-red-500'>*</span>
                </Label>
                <Input name='address_taxpayer' required />
              </FormItem>
              <FormItem className='w-1/3'>
                <Label>
                  Barrio <span className='text-red-500'>*</span>
                </Label>
                <Select name='id_neighborhood' required>
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
                  Cementerio <span className='text-red-500'>*</span>
                </Label>
                <Select name='id_cementery_place' required>
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccione un lugar' />
                  </SelectTrigger>
                  <SelectContent>
                    {cementeryPlaces.map((cementeryPlace) => (
                      <SelectItem
                        key={cementeryPlace.id}
                        value={`${cementeryPlace.id}`}
                      >
                        {cementeryPlace.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
              <FormItem className='flex-1'>
                <Label>
                  Tipo de entierro <span className='text-red-500'>*</span>
                </Label>
                <Select name='id_burial_type' required>
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccione un tipo' />
                  </SelectTrigger>
                  <SelectContent>
                    {burialTypes.map((burialType) => (
                      <SelectItem
                        key={burialType.id}
                        value={`${burialType.id}`}
                      >
                        {burialType.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            <div className='flex gap-2 w-full'>
              <FormItem className='flex-1'>
                <Label>Sección</Label>
                <Input name='section' />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Fila</Label>
                <Input type='number' name='row' min={0} />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Número</Label>
                <Input type='number' name='location_number' min={0} />
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
