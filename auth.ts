import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const INITIAL_CREDIT_BALANCE = 5;

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/login",
  },

  events: {
    async createUser({ user }) {
      // Create Credit row
      await prisma.credit.create({
        data: {
          userId: user.id!,
          balance: INITIAL_CREDIT_BALANCE,
        },
      });

      // Add transaction log
      await prisma.creditTransaction.create({
        data: {
          userId: user.id!,
          amount: INITIAL_CREDIT_BALANCE,
          reason: "SIGNUP",
        },
      });
    },
  },

  callbacks: {
    /**
     * Attach userId to the JWT token.
     */
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      } else if (!token.userId && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true },
        });

        if (dbUser) {
          token.userId = dbUser.id;
        }
      }

      return token;
    },

    /**
     * Expose userId on the session object as session.user.id.
     */
    async session({ session, token }) {
      if (token.userId && typeof token.userId === "string") {
        session.user.id = token.userId;
      }

      return session;
    },
  },
});
