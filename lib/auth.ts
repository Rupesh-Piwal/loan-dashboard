import { auth } from "@/auth";

/**
 * Get the current authenticated user's ID from the session.
 * Use this in server components, server actions, and API routes.
 *
 * @returns { userId: string } or null if not authenticated
 */
export async function getCurrentUser(): Promise<{ userId: string } | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return { userId: session.user.id };
}
