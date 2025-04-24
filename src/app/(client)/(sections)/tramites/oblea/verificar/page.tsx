import { verifyOblea } from '../oblea.actions';
import { PageClient } from './page.client';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    cuit: string;
  }>;
}) {
  const { cuit } = await searchParams;

  const { status, licenseData, error } = await verifyOblea(cuit);

  return (
    <section className='flex flex-col items-center h-[80vh] max-w-6xl mx-auto'>
      <PageClient status={status} licenseData={licenseData} error={error} />
    </section>
  );
}
