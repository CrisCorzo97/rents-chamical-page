import { PrePasswordRecovery } from '../components/pre-password-recovery';

export default async function ResetPasswordRequestPage() {
  return (
    <section className='flex flex-col items-center justify-center h-screen'>
      <PrePasswordRecovery />
    </section>
  );
}
