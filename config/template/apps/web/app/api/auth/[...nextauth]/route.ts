import NextAuth from "next-auth";
import { authConfig } from "@fitted/auth/nextauth";
const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
