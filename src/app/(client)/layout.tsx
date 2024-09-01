import React from 'react';
import { ClientHeader } from './components/ui';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='min-h-screen flex flex-col'>
      <ClientHeader />
      <section className='grow p-4'>{children}</section>
      <footer className='w-full h-28 bg-slate-200 grow-0 mt-8' />
    </main>
  );
}
