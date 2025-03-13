import { TaxpayerPasswordRecoveryForm } from '../components/password-recovery';
import { TaxpayerPasswordRecoveryRequest } from '../components/pre-password-recovery';

export default async function TaxpayerPasswordRecovery({
  searchParams,
}: {
  searchParams: Promise<{
    setPassword: string;
  }>;
}) {
  const { setPassword } = await searchParams;

  return (
    <section className='flex flex-col items-center justify-center h-screen'>
      {setPassword === 'true' ? (
        <TaxpayerPasswordRecoveryForm />
      ) : (
        <TaxpayerPasswordRecoveryRequest />
      )}
    </section>
  );
}
