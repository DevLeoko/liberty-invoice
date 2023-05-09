export const TRANSLATIONS_EN = {
  langCode: "en-US",
  countries: {
    AT: "Austria",
    DE: "Germany",
    PL: "Poland",
    US: "United States",
  },
  invoice: {
    invoice: "Invoice",
    invoiceNumber: "Invoice number",
    invoiceDate: "Invoice date",
    dueDate: "Due date",

    asFreelancer: "Operating as freelancer",

    billedTo: "Billed to",
    dueText: "{{amount}} due {{date}}",
    vatId: "VAT",

    item: "Item",
    quantity: "Qty",
    unitPrice: "Unit price",
    amount: "Amount",
    subtotal: "Subtotal",
    tax: "Tax",
    taxReverseCharge: "Tax be paid on reverse change basis",
    total: "Total",
    page: "Page {{page}} of {{pages}}",

    bankingInfo: "Banking information",
    bank: "Bank",
    paymentDetails: "Payment details",
    paymentDetailsLine1: "Payment due within {{days}} days",
    paymentDetailsLine3: "Bank transfer",
    paymentDetailsLine2: "Please use the invoice number as reference",
    deliveryDateNotice:
      "Delivery date corresponds to invoice date, unless stated otherwise ",
  },
} as const;
