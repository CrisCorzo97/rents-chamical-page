import { LoginForm } from '../components/login-form';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    redirect_to?: string;
  }>;
}) {
  const { redirect_to } = await searchParams;

  return (
    <section className='flex flex-col items-center justify-center h-screen'>
      <LoginForm redirect_to={redirect_to} />
    </section>
  );
}
