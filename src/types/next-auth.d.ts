import 'next-auth';
import 'next-auth/jwt';

type AppRole = 'USER' | 'ADMIN';

declare module 'next-auth' {
  interface User {
    role?: AppRole;
  }

  interface Session {
    user: (DefaultSession['user'] & { role?: AppRole }) | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: AppRole;
  }
}


