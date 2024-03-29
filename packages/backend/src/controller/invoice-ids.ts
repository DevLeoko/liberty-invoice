import { parseInvoiceIdFormat } from '../../../shared/invoice-ids'
import { prisma } from '../prisma'
import { TError } from '../utils/TError'

// Fetching next invoice id:
// - Get current partial id and date
// - If date is not in applicable time range, reset partial id to 0 and date to today
// - Return partial id

// Claim invoice id:
// - Update partial id in database to partial id + 1 if it is still the same as the one passed in
// - Return true if successful, false if not

export async function claimInvoiceId(userId: string, partialId: number): Promise<boolean> {
	const result = await prisma.userSettings.updateMany({
		where: {
			userId,
			nextPartialId: partialId,
		},
		data: {
			nextPartialId: partialId + 1,
		},
	})

	return result.count === 1
}

export async function getNextAvailablePartialId(
	userId: string
): Promise<{ partialId: number; idFormat: string }> {
	const userSettings = await prisma.userSettings.findUnique({
		where: { userId },
	})

	if (!userSettings) throw new TError('error.internalServerError')

	const { nextPartialId, partialIdDate, idFormat } = userSettings

	const { discriminatingTimespan } = parseInvoiceIdFormat(idFormat)

	// TODO: Adjust for time zones of users
	const today = new Date()
	const resetPartialId =
		(discriminatingTimespan == 'year' && today.getFullYear() != partialIdDate.getFullYear()) ||
		(discriminatingTimespan == 'month' && today.getMonth() != partialIdDate.getMonth()) ||
		(discriminatingTimespan == 'day' && today.getDate() != partialIdDate.getDate())

	if (resetPartialId) {
		await prisma.userSettings.update({
			where: { userId },
			data: {
				nextPartialId: 1,
				partialIdDate: today,
			},
		})

		return { partialId: 1, idFormat }
	}

	return { partialId: nextPartialId, idFormat }
}
