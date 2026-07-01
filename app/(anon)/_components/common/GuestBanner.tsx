'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function GuestBanner() {
  const { data: session } = useSession();

  if (!session?.user?.isGuest) return null;

  return (
    <div className="sticky top-0 z-50 bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-sm">
      <span className="text-amber-700">
        게스트 모드입니다. 일부 기능이 제한됩니다.
      </span>
      <Link
        href="/signup"
        className="text-amber-800 font-semibold underline underline-offset-2 whitespace-nowrap ml-3"
      >
        회원가입
      </Link>
    </div>
  );
}
