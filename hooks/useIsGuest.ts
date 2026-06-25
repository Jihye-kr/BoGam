'use client';

import { useSession } from 'next-auth/react';

export function useIsGuest() {
  const { data: session } = useSession();
  return session?.user?.isGuest === true;
}
