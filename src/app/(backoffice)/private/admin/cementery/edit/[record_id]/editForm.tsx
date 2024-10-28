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
import { formatName } from '@/lib/formatters';
import {
  burial_type,
  cementery_place,
  neighborhood,
  Prisma,
} from '@prisma/client';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { updateCementery } from '../../actions.cementery';
import { CementeryRecordWithRelations } from '../../cementery.interface';

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
  last_year_paid: z.nullable(z.number()),
});

interface EditCementeryRecordFormProps {
  record: CementeryRecordWithRelations;
  neighborhoods: neighborhood[];
  burialTypes: burial_type[];
  cementeryPlaces: cementery_place[];
}

export const EditCementeryRecordForm = ({
  record,
  burialTypes,
  neighborhoods,
  cementeryPlaces,
}: EditCementeryRecordFormProps) => {
  const [isMutating, startTransition] = useTransition();
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);

  const { back } = useRouter();

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
        last_year_paid:
          (formObject.last_year_paid as string) === ''
            ? null
            : Number(formObject.last_year_paid as string),
      };

      try {
        formSchema.parse(parsedData);

        try {
          const updatedData: Prisma.cementeryUpdateArgs = {
            where: { id: record.id },
            data: {
              taxpayer: parsedData.taxpayer.toUpperCase(),
              deceased_name: parsedData.deceased_name?.toUpperCase(),
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
              last_year_paid: parsedData.last_year_paid,
            },
          };
          const { success, data, error } = await updateCementery(updatedData);

          if (!success || !data) {
            throw new Error(error ?? '');
          }

          setOpenSuccess(true);
        } catch (error) {
          console.error(error);

          toast.error(
            'Error al editar el registro de cementerio. Revise los datos ingresados e intente nuevamente.',
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
          <AlertDialogTitle>Registro editado</AlertDialogTitle>
          <AlertDialogDescription>
            El registro de cementerio se ha editado correctamente.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Button
                onClick={() => {
                  setOpenSuccess(false);
                  back();
                }}
              >
                Finalizar
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className='w-full max-w-3xl mt-6'>
        <CardHeader>
          <CardTitle>Editar registro</CardTitle>
          <CardDescription>Datos del registro de cementerio</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className='w-full flex flex-col gap-3'>
            <div className='flex gap-2 w-full'>
              <FormItem className='flex-1'>
                <Label>
                  Contribuyente <span className='text-red-500'>*</span>
                </Label>
                <Input
                  name='taxpayer'
                  required
                  defaultValue={formatName(record?.taxpayer ?? '') ?? ''}
                />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Nombre del difunto</Label>
                <Input
                  name='deceased_name'
                  defaultValue={formatName(record?.deceased_name ?? '') ?? ''}
                />
              </FormItem>
            </div>

            <div className='flex gap-2 w-full'>
              <FormItem className='flex-1'>
                <Label>
                  Dirección <span className='text-red-500'>*</span>
                </Label>
                <Input
                  name='address_taxpayer'
                  required
                  defaultValue={record?.address_taxpayer ?? ''}
                />
              </FormItem>
              <FormItem className='w-1/3'>
                <Label>
                  Barrio <span className='text-red-500'>*</span>
                </Label>
                <Select
                  name='id_neighborhood'
                  required
                  defaultValue={
                    record?.id_neighborhood ? `${record.id_neighborhood}` : ''
                  }
                >
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
                <Select
                  name='id_cementery_place'
                  required
                  defaultValue={
                    record?.id_cementery_place
                      ? `${record.id_cementery_place}`
                      : ''
                  }
                >
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
                <Select
                  name='id_burial_type'
                  required
                  defaultValue={
                    record?.id_burial_type ? `${record.id_burial_type}` : ''
                  }
                >
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
                <Input
                  name='section'
                  defaultValue={record?.section ? record.section : ''}
                />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Fila</Label>
                <Input
                  type='number'
                  name='row'
                  min={0}
                  defaultValue={record?.row ? Number(record.row) : ''}
                />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Número</Label>
                <Input
                  type='number'
                  name='location_number'
                  min={0}
                  defaultValue={
                    record?.location_number
                      ? Number(record.location_number)
                      : ''
                  }
                />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Último año pagado</Label>
                <Input
                  type='number'
                  name='last_year_paid'
                  defaultValue={Number(record.last_year_paid)}
                  max={dayjs().year()}
                />
              </FormItem>
            </div>

            <div className='w-full justify-end flex mt-6'>
              <FormItem>
                <Button type='submit' loading={isMutating}>
                  Editar
                </Button>
              </FormItem>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};
