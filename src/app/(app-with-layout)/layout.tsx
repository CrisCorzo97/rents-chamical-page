import { cookies } from 'next/headers';
import { CustomLayout, CustomHeader, CustomContent } from '../ui';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);
  const { data } = await supabase.auth.getUser();

  const isLogged = !!data?.user;

  return (
    <CustomLayout>
      <CustomHeader isLogged={isLogged} />
      <CustomContent>{children}</CustomContent>
    </CustomLayout>
  );
}
