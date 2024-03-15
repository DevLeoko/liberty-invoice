declare namespace Express {
	export interface Request {
		userId?: string
		// eslint-disable-next-line @typescript-eslint/consistent-type-imports
		plan?: import('$shared/plans').Plan | null
	}
}
