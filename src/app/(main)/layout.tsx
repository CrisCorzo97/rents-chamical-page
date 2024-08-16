import { MainHeader } from './components/ui';
import React from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='min-h-screen flex flex-col'>
      <MainHeader />
      <section className='grow p-4'>{children}</section>
      <footer className='w-full h-28 bg-primary grow-0 mt-8' />
    </main>
  );
}
