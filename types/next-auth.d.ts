import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      username?: string;
      nickname?: string;
      isIncomplete?: boolean;
      isGuest?: boolean;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string;
    nickname?: string;
    isGuest?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username?: string;
    nickname?: string;
    isIncomplete?: boolean;
    isGuest?: boolean;
  }
}
