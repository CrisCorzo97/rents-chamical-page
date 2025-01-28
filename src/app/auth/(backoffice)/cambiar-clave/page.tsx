import { ChangePasswordComponent } from './page.client';

export default async function ChangePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    prev_password: string;
  }>;
}) {
  const { prev_password } = await searchParams;

  return <ChangePasswordComponent prevPassword={prev_password} />;
}
