import type {
	Locale,
	ServerTranslationPath,
} from '../../../shared/invoice-translations/translations'
import { translateShared } from '../../../shared/invoice-translations/translations'
import { prisma } from '../prisma'

export async function getFinalTextFragment(data: {
	keys: string[]
	language: Locale
	clientId: string
	userId: string
}) {
	const { clientId, language, keys, userId } = data
	const textFragments = await prisma.textFragment.findMany({
		where: {
			userId: userId,
			key: keys
				? {
						in: keys,
					}
				: undefined,
			OR: [
				{
					clientId: clientId,
				},
				{
					language: language,
				},
			],
		},
	})

	return keys.map((key) => {
		const clientFragment = textFragments.find(
			(textFragment) => textFragment.clientId === clientId && textFragment.key === key
		)
		if (clientFragment) return clientFragment.value

		const defaultFragment = textFragments.find(
			(textFragment) => textFragment.clientId === null && textFragment.key === key
		)
		if (defaultFragment) return defaultFragment.value

		return translateShared(language, `textFragmentDefaults.${key}` as ServerTranslationPath)
	})
}
