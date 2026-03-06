import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.API_URL || 'http://localhost:3001';
const API_SECRET = process.env.INTERNAL_API_SECRET || '';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Verify credentials against our strictly isolated internal Express API
          const res = await fetch(`${API_URL}/api/internal/auth/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 
              'Content-Type': 'application/json',
              'x-api-key': API_SECRET 
            }
          });

          const user = await res.json();
          if (res.ok && user) {
            return user;
          }
          return null;
        } catch (error) {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt", // Credentials providers require JWT strategy
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        // @ts-ignore
        session.user.id = token.sub;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    }
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
