import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

const INITIAL_CREDIT_BALANCE = 5;

export const { handlers, signIn, signOut, auth } = NextAuth({
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

  callbacks: {
    /**
     * Runs on every sign-in attempt.
     * For first-time users: atomically creates User + Credit row.
     * For returning users: no-op, just allows sign-in.
     *
     * Uses upsert to handle race conditions (e.g., double-click login).
     */
    async signIn({ user, profile }) {
      if (!profile?.email) return false;

      try {
        await prisma.$transaction(async (tx) => {
          // Upsert the user — creates if not exists, updates name/avatar if exists
          const dbUser = await tx.user.upsert({
            where: { email: profile.email! },
            create: {
              email: profile.email!,
              name: profile.name ?? null,
              avatarUrl: profile.picture ?? null,
            },
            update: {
              name: profile.name ?? undefined,
              avatarUrl: profile.picture ?? undefined,
            },
          });

          // Ensure Credit row exists (unique constraint on userId prevents duplicates)
          await tx.credit.upsert({
            where: { userId: dbUser.id },
            create: {
              userId: dbUser.id,
              balance: INITIAL_CREDIT_BALANCE,
            },
            update: {}, // No-op if already exists
          });
        });

        return true;
      } catch (error) {
        console.error("[Auth] Error during sign-in:", error);
        return false;
      }
    },

    /**
     * Attach userId to the JWT token.
     * Only does a DB lookup on initial sign-in (when token has no userId yet).
     */
    async jwt({ token, profile }) {
      if (!token.userId && token.email) {
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
