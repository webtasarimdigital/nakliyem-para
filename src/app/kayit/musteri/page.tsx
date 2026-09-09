'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerRegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/kayit?role=musteri');
  }, [router]);

  return (
    <div className="p-16 text-center text-sm text-slate-500">
      Kayıt sayfasına yönlendiriliyorsunuz...
    </div>
  );
}
