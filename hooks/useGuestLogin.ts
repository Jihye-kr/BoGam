'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useGuestLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const loginAsGuest = async () => {
    setLoading(true);
    try {
      const result = await signIn('guest', {
        redirect: false,
        callbackUrl: '/main',
      });
      if (result?.ok) {
        router.replace('/main');
      }
    } finally {
      setLoading(false);
    }
  };

  return { loginAsGuest, loading };
}
