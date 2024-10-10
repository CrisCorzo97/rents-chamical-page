'use client';

import { Input, Label, Select } from '@/components/ui';
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
import { city_section, neighborhood } from '@prisma/client';

interface CreatePropertyRecordFormProps {
  neighborhoods: neighborhood[];
  citySections: city_section[];
}

export const CreatePropertyRecordForm = ({
  citySections,
  neighborhoods,
}: CreatePropertyRecordFormProps) => {
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
          <form action='' className='w-full flex flex-col gap-3'>
            <div className='flex gap-2 w-full'>
              <FormItem>
                <Label>Matrícula</Label>
                <Input name='enrollment' placeholder='Matrícula' />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>
                  Contribuyente <span className='text-red-500'>*</span>
                </Label>
                <Input name='taxpayer' placeholder='Jose Perez' required />
              </FormItem>
              <FormItem>
                <Label>Tipo</Label>
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
              <FormItem className='flex-1'>
                <Label className=''>
                  Dirección <span className='text-red-500'>*</span>
                </Label>
                <Input name='address' placeholder='Matrícula' required />
              </FormItem>
              <FormItem>
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
                <Label className=''>
                  Dirección <span className='text-red-500'>*</span>
                </Label>
                <Input name='address' placeholder='Matrícula' required />
              </FormItem>
              <FormItem>
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
          </form>
        </CardContent>
      </Card>
    </section>
  );
};
