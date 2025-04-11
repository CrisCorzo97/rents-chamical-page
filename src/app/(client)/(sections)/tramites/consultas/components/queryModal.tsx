import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Church, House, SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';

function QueryModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className='w-full max-w-md flex items-start cursor-pointer transition-all hover:text-primary'>
          <CardContent className='w-full p-4 py-4 flex gap-4 items-start'>
            <div className='w-full flex flex-col justify-between gap-2 overflow-hidden'>
              <CardTitle className='text-lg md:text-xl'>
                Estado Impositivo
              </CardTitle>
              <CardDescription className='text-sm md:text-base'>
                Permite verificar la situación fiscal del ciudadano con respecto
                a una tasa / contribución como por ejemplo: tasa por
                mantenimiento de cementerio.
              </CardDescription>
            </div>
            <SquareArrowOutUpRight className='w-6 h-6 md:w-8 md:h-8' />
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] md:max-w-md lg:max-w-lg xl:max-w-xl flex flex-col gap-4 md:gap-6'>
        <DialogHeader>
          <DialogTitle className='text-xl md:text-2xl'>
            Elige una tasa / contribución
          </DialogTitle>
          <DialogDescription className='text-sm md:text-base'>
            Selecciona una tasa / contribución para consultar su estado
            impositivo.
          </DialogDescription>
        </DialogHeader>
        <div className='my-4 flex flex-col sm:flex-row gap-4 items-center justify-center sm:justify-start'>
          <Link
            href='/tramites/consultas/inmueble'
            prefetch
            className='w-full sm:w-auto'
          >
            <Card className='w-full sm:w-40 cursor-pointer transition-all hover:text-primary'>
              <CardContent className='p-4 py-4 flex flex-col gap-3 md:gap-4 items-center justify-center'>
                <House className='w-16 h-16 md:w-24 md:h-24' />
                <CardTitle className='text-lg md:text-xl'>Inmueble</CardTitle>
              </CardContent>
            </Card>
          </Link>
          <Link
            href='/tramites/consultas/cementerio'
            prefetch
            className='w-full sm:w-auto'
          >
            <Card className='w-full sm:w-40 cursor-pointer transition-all hover:text-primary'>
              <CardContent className='p-4 py-4 flex flex-col gap-3 md:gap-4 items-center justify-center'>
                <Church className='w-16 h-16 md:w-24 md:h-24' />
                <CardTitle className='text-lg md:text-xl'>Cementerio</CardTitle>
              </CardContent>
            </Card>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default QueryModal;
