import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString() ?? "";
        const password = credentials?.password?.toString() ?? "";
        // Demo auth: check against locally registered users (from localStorage via cookie-like header is not possible).
        // Since we don't have a DB in this MVP, fallback to accepting any non-empty email/password.
        if (email && password) return { id: email, name: email.split("@")[0], email };
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  // In dev it's fine to use a default; set NEXTAUTH_SECRET in production
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me",
});

export { handler as GET, handler as POST };


