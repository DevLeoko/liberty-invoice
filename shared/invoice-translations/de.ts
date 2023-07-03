import type { TranslationDictionary } from "./translations";

export const TRANSLATIONS_DE: TranslationDictionary = {
  langCodeShort: "de",
  langCode: "de-DE",
  countries: {
    AT: "Österreich",
    DE: "Deutschland",
    PL: "Polen",
    US: "Vereinigte Staaten",
    CN: "China",
    IN: "Indien",
    RU: "Russland",
    BR: "Brasilien",
    JP: "Japan",
    FR: "Frankreich",
    GB: "Vereinigtes Königreich",
    CA: "Kanada",
    AU: "Australien",
    ZA: "Südafrika",
    MX: "Mexiko",
    KR: "Südkorea",
    IT: "Italien",
    SA: "Saudi-Arabien",
    TR: "Türkei",
    ID: "Indonesien",
    NG: "Nigeria",
    AR: "Argentinien",
    IR: "Iran",
    EG: "Ägypten",
    NL: "Niederlande",
    CH: "Schweiz",
    ES: "Spanien",
    SE: "Schweden",
    BE: "Belgien",
    PT: "Portugal",
    DK: "Dänemark",
    FI: "Finnland",
    NO: "Norwegen",
    IL: "Israel",
    PK: "Pakistan",
    MY: "Malaysia",
    PH: "Philippinen",
    TH: "Thailand",
    VN: "Vietnam",
    SG: "Singapur",
    NZ: "Neuseeland",
    CO: "Kolumbien",
    VE: "Venezuela",
    PE: "Peru",
    CL: "Chile",
    GR: "Griechenland",
    HU: "Ungarn",
    AE: "Vereinigte Arabische Emirate",
    KE: "Kenia",
    ET: "Äthiopien",
    GH: "Ghana",
    TZ: "Tansania",
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
