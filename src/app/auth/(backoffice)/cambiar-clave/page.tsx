import { ChangePassword } from '../components/change-password';

export default async function ChangePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    prev_password: string;
  }>;
}) {
  const { prev_password } = await searchParams;

  return (
    <section className='flex flex-col items-center justify-center h-screen'>
      <ChangePassword prevPassword={prev_password} />
    </section>
  );
}
