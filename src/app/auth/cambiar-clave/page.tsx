import { ChangePasswordComponent } from './page.client';

export default function ChangePasswordPage({
  searchParams: { prev_password },
}: {
  searchParams: {
    prev_password: string;
  };
}) {
  return <ChangePasswordComponent prevPassword={prev_password} />;
}
