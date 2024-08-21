import { LogoRD, LogoRents } from '@/assets/icons';
import { ChevronRight } from 'lucide-react';

export const Sidebar = () => {
  return (
    <nav className='fixed w-56 top-0 left-0 h-screen bg-secondary'>
      <header className='relative'>
        <div className='flex items-center'>
          <span className='min-w-14 flex items-center justify-center'>
            <LogoRD className='w-10' />
          </span>

          <div className='w-full flex items-center'>
            <LogoRents className='w-32' />
          </div>
        </div>

        <span className='w-6 h-6 absolute top-1/2 -right-4 transform -translate-y-1/2 bg-primary flex items-center justify-center rounded-full'>
          <ChevronRight className='w-5 h-5 text-primary-foreground' />
        </span>
      </header>
    </nav>
  );
};
