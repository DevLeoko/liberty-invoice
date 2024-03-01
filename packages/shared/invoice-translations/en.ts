export const TRANSLATIONS_EN = {
  langCodeShort: "en",
  langCode: "en-US",
  countries: {
    AT: "Austria",
    DE: "Germany",
    PL: "Poland",
    US: "United States",
    CN: "China",
    IN: "India",
    RU: "Russia",
    BR: "Brazil",
    JP: "Japan",
    FR: "France",
    GB: "United Kingdom",
    CA: "Canada",
    AU: "Australia",
    ZA: "South Africa",
    MX: "Mexico",
    KR: "South Korea",
    IT: "Italy",
    SA: "Saudi Arabia",
    TR: "Turkey",
    ID: "Indonesia",
    NG: "Nigeria",
    AR: "Argentina",
    IR: "Iran",
    EG: "Egypt",
    NL: "Netherlands",
    CH: "Switzerland",
    ES: "Spain",
    SE: "Sweden",
    BE: "Belgium",
    PT: "Portugal",
    DK: "Denmark",
    FI: "Finland",
    NO: "Norway",
    IL: "Israel",
    PK: "Pakistan",
    MY: "Malaysia",
    PH: "Philippines",
    TH: "Thailand",
    VN: "Vietnam",
    SG: "Singapore",
    NZ: "New Zealand",
    CO: "Colombia",
    VE: "Venezuela",
    PE: "Peru",
    CL: "Chile",
    GR: "Greece",
    HU: "Hungary",
    AE: "United Arab Emirates",
    KE: "Kenya",
    ET: "Ethiopia",
    GH: "Ghana",
    TZ: "Tanzania",
    UA: "Ukraine",
    MA: "Morocco",
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

  textFragmentDefaults: {
    mail: {
      invoiceSubject: "Invoice {invoiceNumber}",
      invoiceText:
        "Dear {clientName},\n\nPlease find attached your invoice {invoiceNumber} for {invoiceTotal}.\n\nKind regards,\n{businessName}",
    },
    invoice: {
      note: "",
      footerNote:
        "Delivery date corresponds to invoice date, unless stated otherwise",
      paymentNote: "Please use the invoice number as reference",
    },
  },

  taxRate: {
    reverseChargeName: "Reverse charge",
    reverseCharge: "Tax be paid on reverse change basis",
  },

  error: {
    sessionExpired: "Your session expired",
    internalServerError: "Something went wrong, please try again later.",
    notAuthenticated: "You are not logged in.",
    googleAuthFailed: "Google authentication failed.",
    noLinkedAccount:
      "There is no account linked to this email address. Please sign up.",
    invalidEmailOrPassword: "Invalid email or password.",
    emailNotVerified: "Your email address has not been verified.",
    notPasswordAccount: "Please use the Google login for this account.",
    invalidToken: "This link is expired or invalid.",
    emailAlreadyInUse: "This email address is already in use.",
    failedCaptcha: "Captcha failed.",
    invalidInput: "Invalid input.",

    client: {
      notFound: "Client not found.",
    },

    invoice: {
      notFound: "Invoice not found.",
      partialIdAlreadyClaimed: "This invoice id is already claimed.",
    },

    product: {
      notFound: "Product not found.",
    },
  },
} as const;