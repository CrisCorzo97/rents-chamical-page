import React from 'react';
import { MainHeader } from '../ui';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='min-h-screen flex flex-col'>
      <MainHeader />
      <section className='grow px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 max-w-7xl mx-auto w-full'>
        {children}
      </section>
      {/* <footer className='w-full h-28 bg-slate-200 grow-0 mt-8' /> */}
    </main>
  );
}
