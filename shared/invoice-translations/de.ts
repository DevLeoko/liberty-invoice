import type { TranslationDictionary } from "./translations";

export const TRANSLATIONS_DE: TranslationDictionary = {
  langCode: "de-DE",
  countries: {
    AT: "Österreich",
    DE: "Deutschland",
    PL: "Polen",
    US: "Vereinigte Staaten",
  },
  invoice: {
    invoice: "Rechnung",
    invoiceNumber: "Rechnungsnummer",
    invoiceDate: "Rechnungsdatum",
    dueDate: "Fälligkeitsdatum",

    asFreelancer: "Tätig als Freiberufler",

    billedTo: "Rechnungsempfänger",
    dueText: "{{amount}} fällig am {{date}}",
    vatId: "USt-ID",

    item: "Artikel",
    quantity: "Menge",
    unitPrice: "Preis",
    amount: "Betrag",
    subtotal: "Zwischensumme",
    tax: "Steuer",
    taxReverseCharge:
      "Steuerschuldschaft durch Leistungsempfänger (Reverse Charge)",
    total: "Gesamt",
    page: "Seite {{page}} von {{pages}}",

    bankingInfo: "Bankverbindung",
    bank: "Bank",
    paymentDetails: "Zahlungsinformationen",
    paymentDetailsLine1: "Zahlbar innerhalb von {{days}} Tagen",
    paymentDetailsLine3: "Banküberweisung",
    paymentDetailsLine2:
      "Bitte geben Sie die Rechnungsnummer als Verwendungszweck an",

    deliveryDateNotice:
      "Soweit nicht anders angegeben, enspricht Lieferdatum dem Rechnungsdatum",
  },

  textFragmentDefaults: {
    mail: {
      invoiceSubject: "Rechnung {invoiceNumber}",
      invoiceText:
        "Guten Tag {clientName},\n\nanbei erhalten Sie Ihre Rechnung {invoiceNumber} über {invoiceTotal}.\n\nMit freundlichen Grüßen,\n{businessName}",
    },
    invoice: {
      note: "",
      footerNote:
        "Soweit nicht anders angegeben, enspricht Lieferdatum dem Rechnungsdatum",
      paymentNote:
        "Bitte geben Sie die Rechnungsnummer als Verwendungszweck an",
    },
  },
};
