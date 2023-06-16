export function computeTotalExcludingTax(invoice: {
  items: { unitPrice: number; quantity: number }[];
}) {
  return invoice.items.reduce((total, item) => {
    return total + item.unitPrice * item.quantity;
  }, 0);
}

export function computeTotalWithTax(invoice: {
  items: { unitPrice: number; quantity: number }[];
  taxRates: { rate: number }[];
}) {
  const withoutTax = computeTotalExcludingTax(invoice);

  return invoice.taxRates.reduce((total, taxRate) => {
    return total + withoutTax * (taxRate.rate / 100);
  }, withoutTax);
}
