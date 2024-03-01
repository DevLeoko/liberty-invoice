import type { ServerTranslationPath } from '../../../shared/invoice-translations/translations'

export class TError extends Error {
	constructor(message: ServerTranslationPath) {
		super(message)
	}
}
