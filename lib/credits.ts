import { prisma } from "@/lib/prisma";

export async function deductCredits(userId: string, amount: number) {
  return await prisma.$transaction(async (tx) => {
    const credit = await tx.credit.findUnique({
      where: { userId },
    });

    if (!credit || credit.balance < amount) {
      throw new Error("Insufficient credits");
    }

    await tx.credit.update({
      where: { userId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        amount: -amount,
        reason: "GENERATION",
      },
    });
  });
}
