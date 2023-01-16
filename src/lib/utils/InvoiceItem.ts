export interface InvoiceItem {
	id: number
	name: string
	quantity: number
	unit?: string
	unitPrice: number
}

export const SAMPLE_INVOICE_ITEMS: InvoiceItem[] = [
	{
		id: 1,
		name: 'Custom development',
		quantity: 12,
		unit: 'h',
		unitPrice: 4.3
	},
	{
		id: 2,
		name: 'EC2 Instance',
		quantity: 3,
		unitPrice: 87.45
	},
	{
		id: 3,
		name: 'Elastic IP',
		quantity: 1,
		unitPrice: 4.5
	},
	{
		id: 4,
		name: 'EBS Volume',
		quantity: 1,
		unitPrice: 2.7
	},
	{
		id: 5,
		name: 'Software development',
		quantity: 1,
		unitPrice: 12.5
	},
	{
		id: 6,
		name: 'Consulting',
		quantity: 1,
		unit: 'h',
		unitPrice: 50
	},
	{
		id: 7,
		name: 'Travel expenses',
		quantity: 1,
		unit: 'km',
		unitPrice: 0.5
	},
	{
		id: 8,
		name: 'EBS Snapshot',
		quantity: 2,
		unitPrice: 1.2
	},
	{
		id: 9,
		name: 'S3 Storage',
		quantity: 1,
		unitPrice: 0.45
	}
]
