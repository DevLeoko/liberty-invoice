import { parseInvoiceIdFormat } from "../../../shared/invoice-ids";
import { prisma } from "../prisma";

// Fetching next invoice id:
// - Get current partial id and date
// - If date is not in applicable time range, reset partial id to 0 and date to today
// - Return partial id

// Claim invoice id:
// - Update partial id in database to partial id + 1 if it is still the same as the one passed in
// - Return true if successful, false if not

export async function claimInvoiceId(
  userId: number,
  partialId: number
): Promise<boolean> {
  const result = await prisma.userSettings.updateMany({
    where: {
      userId,
      nextPartialId: partialId,
    },
    data: {
      nextPartialId: partialId + 1,
    },
  });

  return result.count === 1;
}

export async function getNextAvailablePartialId(
  userId: number
): Promise<{ partialId: number; idFormat: string }> {
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId },
  });

  if (!userSettings) throw new Error("error.user.notFound");

  const { nextPartialId, partialIdDate, idFormat } = userSettings;

  const { discriminatingTimespan } = parseInvoiceIdFormat(idFormat);

  // TODO: Adjust for time zones of users
  const today = new Date();
  let resetPartialId =
    (discriminatingTimespan == "year" &&
      today.getFullYear() != partialIdDate.getFullYear()) ||
    (discriminatingTimespan == "month" &&
      today.getMonth() != partialIdDate.getMonth()) ||
    (discriminatingTimespan == "day" &&
      today.getDate() != partialIdDate.getDate());

  if (resetPartialId) {
    await prisma.userSettings.update({
      where: { userId },
      data: {
        nextPartialId: 0,
        partialIdDate: today,
      },
    });

    return { partialId: 0, idFormat };
  }

  return { partialId: nextPartialId, idFormat };
}
