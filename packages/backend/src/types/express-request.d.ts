declare namespace Express {
	export interface Request {
		// eslint-disable-next-line @typescript-eslint/consistent-type-imports
		auth?: import('$shared/AuthPayload').AuthPayload
	}
}
