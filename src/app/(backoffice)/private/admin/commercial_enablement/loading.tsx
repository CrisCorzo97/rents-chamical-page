import { Loader2 } from 'lucide-react';

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div
      style={{ minHeight: 'calc(100vh - 64px)' }}
      className='w-full flex items-center justify-center'
    >
      <Loader2 size={24} className='animate-spin text-primary' />
    </div>
  );
}
