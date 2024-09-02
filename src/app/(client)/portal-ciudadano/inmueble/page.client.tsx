'use client';

import useRecaptcha from '@/hooks/useRecaptcha';

export const RequestPropertyClientPage = () => {
  const { capchaToken, recaptchaRef, handleRecaptcha } = useRecaptcha();

  return <div>page.client</div>;
};
