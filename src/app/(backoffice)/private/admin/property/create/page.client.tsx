'use client';

import { Button, Input, Label, Select } from '@/components/ui';
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
import { Switch } from '@/components/ui/switch';
import { city_section, neighborhood } from '@prisma/client';
import { useTransition } from 'react';

interface CreatePropertyRecordFormProps {
  neighborhoods: neighborhood[];
  citySections: city_section[];
}

export const CreatePropertyRecordForm = ({
  citySections,
  neighborhoods,
}: CreatePropertyRecordFormProps) => {
  const [isMutating, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {});
  };

  return (
    <section>
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
                <Input name='taxpayer' placeholder='Jose Perez' required />
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
                <Input name='enrollment' placeholder='XXXX-XXXX-XXX' />
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
                <Input name='address' placeholder='9 de Julio' required />
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
              <FormItem className='w-1/3'>
                <Label>Sección</Label>
                <Select name='city_section'>
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
              <FormItem className='w-1/3'>
                <Label>
                  Mts de frente <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='number'
                  name='front_length'
                  required
                  placeholder='10'
                />
              </FormItem>
            </div>

            <div className='w-full justify-end flex mt-6'>
              <FormItem>
                <Button type='submit' className=''>
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
