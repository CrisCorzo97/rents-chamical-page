import { PreRegisterForm } from '../components/pre-register-form';
import { getRoles } from '../auth-bo.actions';

export default async function RegistrationRequestPage() {
  const { data } = await getRoles();

  return (
    <section className='flex flex-col items-center justify-center h-screen'>
      <PreRegisterForm roles={data ?? []} />
    </section>
  );
}
