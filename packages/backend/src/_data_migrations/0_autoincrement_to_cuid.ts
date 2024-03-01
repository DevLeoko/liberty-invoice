import { createId } from '@paralleldrive/cuid2'
import { PrismaClient } from '@prisma/client'

const ALIGN_WITH_SCHEMA_QUERY = `
ALTER TABLE \`_InvoiceToTaxRate\` DROP FOREIGN KEY \`fk__InvoiceToTaxRate_Invoice_A\`;

ALTER TABLE \`_InvoiceToTaxRate\` DROP FOREIGN KEY \`fk__InvoiceToTaxRate_TaxRate_B\`;

ALTER TABLE \`Client\` DROP FOREIGN KEY \`fk_Client_TaxRate_defaultTaxRateId\`;

ALTER TABLE \`Client\` DROP FOREIGN KEY \`fk_Client_User_userId\`;

ALTER TABLE \`Invoice\` DROP FOREIGN KEY \`fk_Invoice_Client_clientId\`;

ALTER TABLE \`Invoice\` DROP FOREIGN KEY \`fk_Invoice_User_userId\`;

ALTER TABLE \`InvoiceItem\` DROP FOREIGN KEY \`fk_InvoiceItem_Invoice_invoiceId\`;

ALTER TABLE \`InvoiceItem\` DROP FOREIGN KEY \`fk_InvoiceItem_Product_productId\`;

ALTER TABLE \`InvoiceItem\` DROP FOREIGN KEY \`fk_InvoiceItem_User_userId\`;

ALTER TABLE \`Product\` DROP FOREIGN KEY \`fk_Product_User_userId\`;

ALTER TABLE \`TaxRate\` DROP FOREIGN KEY \`fk_TaxRate_User_userId\`;

ALTER TABLE \`TextFragment\` DROP FOREIGN KEY \`fk_TextFragment_Client_clientId\`;

ALTER TABLE \`TextFragment\` DROP FOREIGN KEY \`fk_TextFragment_User_userId\`;

ALTER TABLE \`UserSettings\` DROP FOREIGN KEY \`fk_UserSettings_TaxRate_defaultTaxRateId\`;

ALTER TABLE \`UserSettings\` DROP FOREIGN KEY \`fk_UserSettings_User_userId\`;

DROP INDEX \`Invoice_userId_invoiceNumber_key\` ON \`Invoice\`;

CREATE UNIQUE INDEX \`_InvoiceToTaxRate_AB_unique\` ON \`_InvoiceToTaxRate\`(\`A\`, \`B\`);

CREATE UNIQUE INDEX \`Invoice_userId_invoiceNumber_key\` ON \`Invoice\`(\`userId\`, \`invoiceNumber\`);

CREATE UNIQUE INDEX \`UserSettings_userId_key\` ON \`UserSettings\`(\`userId\`);

ALTER TABLE \`UserSettings\` ADD CONSTRAINT \`UserSettings_userId_fkey\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE \`UserSettings\` ADD CONSTRAINT \`UserSettings_defaultTaxRateId_fkey\` FOREIGN KEY (\`defaultTaxRateId\`) REFERENCES \`TaxRate\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE \`TaxRate\` ADD CONSTRAINT \`TaxRate_userId_fkey\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE \`Client\` ADD CONSTRAINT \`Client_userId_fkey\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE \`Client\` ADD CONSTRAINT \`Client_defaultTaxRateId_fkey\` FOREIGN KEY (\`defaultTaxRateId\`) REFERENCES \`TaxRate\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE \`Invoice\` ADD CONSTRAINT \`Invoice_userId_fkey\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE \`Invoice\` ADD CONSTRAINT \`Invoice_clientId_fkey\` FOREIGN KEY (\`clientId\`) REFERENCES \`Client\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE \`InvoiceItem\` ADD CONSTRAINT \`InvoiceItem_userId_fkey\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE \`InvoiceItem\` ADD CONSTRAINT \`InvoiceItem_invoiceId_fkey\` FOREIGN KEY (\`invoiceId\`) REFERENCES \`Invoice\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE \`InvoiceItem\` ADD CONSTRAINT \`InvoiceItem_productId_fkey\` FOREIGN KEY (\`productId\`) REFERENCES \`Product\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE \`Product\` ADD CONSTRAINT \`Product_userId_fkey\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE \`TextFragment\` ADD CONSTRAINT \`TextFragment_userId_fkey\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE \`TextFragment\` ADD CONSTRAINT \`TextFragment_clientId_fkey\` FOREIGN KEY (\`clientId\`) REFERENCES \`Client\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE \`_InvoiceToTaxRate\` ADD CONSTRAINT \`_InvoiceToTaxRate_A_fkey\` FOREIGN KEY (\`A\`) REFERENCES \`Invoice\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE \`_InvoiceToTaxRate\` ADD CONSTRAINT \`_InvoiceToTaxRate_B_fkey\` FOREIGN KEY (\`B\`) REFERENCES \`TaxRate\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE \`_InvoiceToTaxRate\` RENAME INDEX \`_InvoiceToTaxRate_B_fkey\` TO \`_InvoiceToTaxRate_B_index\``

export const prisma = new PrismaClient({
	log: ['query', 'info', 'warn', 'error'],
})

const entityNames = [
	'User',
	'UserSettings',
	'TaxRate',
	'Client',
	'Invoice',
	'InvoiceItem',
	'Product',
	'TextFragment',
]

const relations: [string, string, string, boolean?][] = [
	['UserSettings', 'User', 'userId', true],
	['UserSettings', 'TaxRate', 'defaultTaxRateId', true],
	['TaxRate', 'User', 'userId'],
	['Client', 'User', 'userId'],
	['Client', 'TaxRate', 'defaultTaxRateId', true],
	['Invoice', 'User', 'userId'],
	['Invoice', 'Client', 'clientId'],
	['InvoiceItem', 'User', 'userId'],
	['InvoiceItem', 'Invoice', 'invoiceId'],
	['InvoiceItem', 'Product', 'productId', true],
	['Product', 'User', 'userId'],
	['TextFragment', 'User', 'userId'],
	['TextFragment', 'Client', 'clientId', true],
	['_InvoiceToTaxRate', 'Invoice', 'A'],
	['_InvoiceToTaxRate', 'TaxRate', 'B'],
]

// This migration will convert all primary keys from autoincrementing integers to CUIDs

async function runMigration() {
	// Add CUID column to all entities
	for (const entityName of entityNames) {
		await prisma.$executeRawUnsafe(
			`ALTER TABLE \`${entityName}\` ADD COLUMN \`cid\` VARCHAR(191) NOT NULL;`
		)

		// Generate new CUIDs for all existing records
		const records = await prisma.$queryRawUnsafe<{ id: number }[]>(
			`SELECT id FROM \`${entityName}\``
		)

		const queries = []
		for (const record of records) {
			const cid = createId()
			queries.push(
				prisma.$executeRawUnsafe(
					`UPDATE \`${entityName}\` SET cid = '${cid}' WHERE id = ${record.id}`
				)
			)
		}
		await Promise.all(queries)
	}

	// Drop all constraints
	for (const [entityName, relatedEntityName, columnName, nullable] of relations) {
		// Drop constraint
		await prisma.$executeRawUnsafe(
			`ALTER TABLE \`${entityName}\` DROP FOREIGN KEY \`${entityName}_${columnName}_fkey\`;`
		)
	}

	// Drop constraint _InvoiceToTaxRate_AB_unique for _InvoiceToTaxRate
	await prisma.$executeRawUnsafe(
		`ALTER TABLE \`_InvoiceToTaxRate\` DROP INDEX \`_InvoiceToTaxRate_AB_unique\`;`
	)

	// Add CUID columns for all relations
	for (const [entityName, relatedEntityName, columnName, nullable] of relations) {
		await prisma.$executeRawUnsafe(
			`ALTER TABLE \`${entityName}\` ADD COLUMN \`${columnName}Cid\` VARCHAR(191) ${
				nullable ? '' : 'NOT NULL'
			};`
		)

		// Update references to use CUIDs
		await prisma.$executeRawUnsafe(
			`UPDATE \`${entityName}\` e
      JOIN \`${relatedEntityName}\` re ON e.${columnName} = re.id
      SET e.${columnName}Cid = re.cid;`
		)

		// Drop old column
		await prisma.$executeRawUnsafe(`ALTER TABLE \`${entityName}\` DROP COLUMN \`${columnName}\`;`)

		// Rename new column
		await prisma.$executeRawUnsafe(
			`ALTER TABLE \`${entityName}\` CHANGE \`${columnName}Cid\` \`${columnName}\` VARCHAR(191) ${
				nullable ? '' : 'NOT NULL'
			};`
		)
	}

	// Change primary keys to CUIDs
	for (const entityName of entityNames) {
		// Remove autoincrement from id
		await prisma.$executeRawUnsafe(
			`ALTER TABLE \`${entityName}\` CHANGE COLUMN \`id\` \`id\` INT(11) NOT NULL;`
		)

		await prisma.$executeRawUnsafe(
			`ALTER TABLE \`${entityName}\` DROP PRIMARY KEY, ADD PRIMARY KEY (\`cid\`);`
		)
	}

	// Remove old columns
	for (const entityName of entityNames) {
		await prisma.$executeRawUnsafe(`ALTER TABLE \`${entityName}\` DROP COLUMN \`id\`;`)
	}

	// Rename cid columns to id
	for (const entityName of entityNames) {
		await prisma.$executeRawUnsafe(
			`ALTER TABLE \`${entityName}\` CHANGE \`cid\` \`id\` VARCHAR(191) NOT NULL;`
		)
	}

	// Add constraints for relations
	for (const [entityName, relatedEntityName, columnName] of relations) {
		await prisma.$executeRawUnsafe(
			`ALTER TABLE \`${entityName}\` ADD CONSTRAINT \`fk_${entityName}_${relatedEntityName}_${columnName}\` FOREIGN KEY (\`${columnName}\`) REFERENCES \`${relatedEntityName}\`(\`id\`);`
		)
	}

	for (const query of ALIGN_WITH_SCHEMA_QUERY.split(';')) {
		await prisma.$executeRawUnsafe(query)
	}
}

runMigration()
