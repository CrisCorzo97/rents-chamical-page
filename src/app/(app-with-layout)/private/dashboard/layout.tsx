import { Button } from '@/components/ui';

export default async function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='min-h-full w-full flex gap-2'>
      <div className='max-w-xs w-full bg-white min-h-screen'>
        <Button>Botón 1</Button>
      </div>
      {children}
    </main>
  );
}
