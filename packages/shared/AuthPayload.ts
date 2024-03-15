import type { Plan } from './plans'

export type AuthPayload = { userId: string; plan: Plan | null; accountMail: string }
