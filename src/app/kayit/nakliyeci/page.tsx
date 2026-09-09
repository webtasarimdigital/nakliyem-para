'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NakliyeciRegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/kayit?role=nakliyeci');
  }, [router]);

  return (
    <div className="p-16 text-center text-sm text-slate-500">
      Nakliyeci kayıt ekranına yönlendiriliyorsunuz...
    </div>
  );
}
