import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [
    Google({ clientId: process.env.GOOGLE_ID!, clientSecret: process.env.GOOGLE_SECRET! }),
    Credentials({
      name: "Magic",
      credentials: { email: { label: "Email", type: "email" } },
      async authorize(c){ return c?.email ? { id:c.email, email:c.email } : null; }
    })
  ],
  trustHost: true,
  session: { strategy: "jwt" }
} satisfies NextAuthConfig;
