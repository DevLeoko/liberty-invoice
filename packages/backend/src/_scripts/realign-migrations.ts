import { createHash } from 'crypto'
import { readFileSync, readdirSync } from 'fs'
import { prisma } from '../prisma'

async function realignChecksums() {
	for (const name of readdirSync('prisma/migrations').filter(
		(e) => e.startsWith('20') || e.startsWith('0_')
	)) {
		const checksum = createHash('sha256')
			.update(readFileSync(`prisma/migrations/${name}/migration.sql`))
			.digest('hex')
		await prisma.$executeRaw`UPDATE _prisma_migrations SET checksum = ${checksum}, applied_steps_count = 1 WHERE migration_name = ${name}`
	}
}

realignChecksums().then(() => {
	console.log('Done!')
})
