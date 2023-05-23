export function computeTotalExcludingTax(invoice: {
  items: { unitPrice: number; quantity: number }[];
}) {
  return invoice.items.reduce((total, item) => {
    return total + item.unitPrice * item.quantity;
  }, 0);
}

export function computeTotalWithTax(invoice: {
  items: { unitPrice: number; quantity: number }[];
}) {
  // TODO: implement
  return computeTotalExcludingTax(invoice);
}
