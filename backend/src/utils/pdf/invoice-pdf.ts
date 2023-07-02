import { Prisma } from "@prisma/client";
import fs from "fs/promises";
import imageSize from "image-size";
import {
  PdfBlueprint,
  PdfDocument,
  ppColumn,
  ppDiv,
  ppImage,
  ppRow,
  ppSizedBox,
  ppTable,
  ppTableHeader,
  ppTableRow,
  ppText,
} from "painless-pdf";
import { promisify } from "util";
import { getClientDisplayLines } from "../../../../shared/address-formatter";
import { getCurrency } from "../../../../shared/currencies";
import {
  KeyPath,
  Locale,
  getTranslationDictionary,
  translate,
} from "../../../../shared/invoice-translations/translations";
import { getFinalTextFragment } from "../../controller/text-fragments";
import { addAllRobotoFonts } from "./pdf-fonts";

const imageSizeAsync = promisify(imageSize);

export type Invoice = Prisma.InvoiceGetPayload<{
  include: {
    user: {
      include: {
        userSettings: true;
      };
    };
    client: true;
    items: true;
    taxRates: true;
  };
}>;

interface Address {
  name: string;
  shorthand: string;
  additionalLine: string;
  firstName: string;
  lastName: string;
  contactPhone: string;
  contactEmail: string;
  vatNumber: string;

  street: string;
  streetNumber: string;
  city: string;
  zip: string;
  countryCode: string;
}

export async function buildInvoicePdf(invoice: Invoice) {
  const account = invoice.user.userSettings!;
  const client = invoice.client;

  const [footerNote, paymentNote] = await getFinalTextFragment({
    keys: ["invoice.footerNote", "invoice.paymentNote"],
    language: invoice.language as Locale,
    clientId: invoice.clientId,
    userId: invoice.userId,
  });

  function getTotal() {
    return invoice.items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0
    );
  }

  const dictionary = getTranslationDictionary(invoice.language as Locale);
  const t = (key: KeyPath<typeof dictionary>, vars?: Record<string, string>) =>
    translate(dictionary, key, vars);

  function formatDate(date: Date) {
    return date.toLocaleDateString(t("langCode"), {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  function formatFloat(number: number, short?: boolean) {
    return number.toLocaleString(t("langCode"), {
      minimumFractionDigits: short ? 0 : 2,
      maximumFractionDigits: 2,
    });
  }

  const numberFormatter = (number: number) =>
    number.toLocaleString(t("langCode"), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const currency = getCurrency(invoice.currency, numberFormatter);

  async function ppCompanyLogo() {
    const logoPath = `${process.env.FILE_STORAGE_PATH}/logos/${account.logoUrl}`;

    // Check if file exists
    if (!(await fs.stat(logoPath).catch(() => false))) {
      return ppText("");
    }

    const imageSize = await imageSizeAsync(logoPath);

    const file = await fs.readFile(logoPath, { encoding: "base64" });

    return ppImage({
      base64: file,
      fileType: "PNG",
      originalHeight: imageSize?.height ?? 0,
      originalWidth: imageSize?.width ?? 0,
      width: 60,
    });
  }

  async function ppHeader() {
    return ppRow(
      [
        ppColumn([
          ppText(t("invoice.invoice"), { fontSize: 22 }),
          ppSizedBox({ height: 5 }),
          ppTable({
            rows: [
              ppTableRow([
                ppText(t("invoice.invoiceNumber")),
                ppText(invoice.invoiceNumber, { fontWeight: 500 }),
              ]),
              ppTableRow([
                ppText(t("invoice.invoiceDate")),
                ppText(formatDate(invoice.date), { fontWeight: 500 }),
              ]),
              ppTableRow([
                ppText(t("invoice.dueDate")),
                ppText(formatDate(invoice.dueDate), { fontWeight: 500 }),
              ]),
            ],
            widths: [32, 30],
            options: {
              text: {
                lineHeightFactor: 1.5,
              },
            },
          }),
        ]),
        await ppCompanyLogo(),
      ],
      {
        mainAxisAlignment: "space-between",
        width: { relative: 1 },
        div: {
          padding: {
            bottom: 10,
          },
        },
      }
    );
  }

  function ppFooter(page: number, pageCount: number) {
    const accountName =
      account.firstName && account.lastName
        ? `${account.firstName} ${account.lastName}`
        : account.name || "";

    return ppRow(
      [
        ppColumn(
          [
            ppText(t("invoice.bankingInfo"), { bold: true }),
            ppText(accountName),
            ppText(`${t("invoice.bank")}: ${account.bankName}`),
            ppText(`IBAN: ${account.iban}`),
            ppText(`BIC: ${account.bic}`),
          ],
          {
            width: { relative: 0.32 },
          }
        ),
        ppColumn(
          [
            ppText(t("invoice.paymentDetails"), { bold: true }),
            ppText(
              t("invoice.paymentDetailsLine1", {
                days: client.defaultDueDays.toString(),
              })
            ),
            ppText(paymentNote),
            ppText(t("invoice.paymentDetailsLine3")),
          ],
          {
            width: { relative: 0.32 },
          }
        ),

        ppColumn(
          [
            ppText(footerNote),
            "spacer",
            ppText(
              t("invoice.page", {
                page: (page + 1).toString(),
                pages: pageCount.toString(),
              }),
              {
                align: "right",
                width: { relative: 1 },
              }
            ),
          ],
          {
            width: { relative: 0.32 },
          }
        ),
      ],
      {
        mainAxisAlignment: "space-between",
        crossAxisAlignment: "stretch",
        width: { relative: 1 },
        text: {
          fontSize: 8.5,
        },
        div: {
          border: {
            top: {
              width: 0.2,
              color: "#e4e8f0",
            },
          },
          padding: {
            top: 5,
          },
        },
      }
    );
  }

  function ppInvoice() {
    return ppColumn([
      ppRow([ppAddress(client, t("invoice.billedTo")), ppAddress(account)], {
        width: { relative: 1 },
        mainAxisAlignment: "space-between",
      }),
      ppSizedBox({ height: 10 }),
      ppText(
        t("invoice.dueText", {
          amount: `${currency.shorthand} ${formatFloat(getTotal())}`,
          date: formatDate(invoice.dueDate),
        }),
        {
          fontSize: 16,
          fontWeight: 500,
        }
      ),
      ppSizedBox({ height: 2 }),
      ppText(invoice.note),
      ppSizedBox({ height: 5 }),
      ppInvoiceTable(),
    ]);
  }

  function ppInvoiceTable() {
    return ppColumn([ppItemList(), ppHr(), ppItemListTotal()], {
      crossAxisAlignment: "end",
    });
  }

  function ppHr() {
    return ppDiv(ppSizedBox({ height: 0.2, width: { relative: 1 } }), {
      backgroundColor: "#a0acba",
    });
  }

  function ppItemListTotal() {
    let startGray = invoice.items.length % 2 == 0;

    return ppColumn(
      [
        ppRow(
          [
            ppText(t("invoice.subtotal")),
            ppText(`${currency.format(getTotal())}`),
          ],
          {
            mainAxisAlignment: "space-between",
            width: { relative: 1 },
            div: {
              padding: 2,
              backgroundColor: startGray ? "#f3f7fc" : undefined,
            },
          }
        ),
        ppRow([ppText(t("invoice.taxReverseCharge"))], {
          width: { relative: 1 },
          div: {
            padding: 2,
            backgroundColor: !startGray ? "#f3f7fc" : undefined,
          },
        }),
        ppHr(),
        ppRow(
          [
            ppText(t("invoice.total")),
            ppText(`${currency.format(getTotal())}`),
          ],
          {
            mainAxisAlignment: "space-between",
            width: { relative: 1 },
            text: {
              fontWeight: 500,
            },
            div: {
              padding: 2,
              backgroundColor: "#e4e8f0",
            },
          }
        ),
      ],
      {
        width: 64,
      }
    );
  }

  function ppItemList() {
    return ppTable({
      header: ppTableHeader(
        [
          ppText(t("invoice.item")),
          ppText(t("invoice.quantity")),
          ppText(t("invoice.unitPrice")),
          ppText(t("invoice.total"), {
            width: { relative: 1 },
            align: "right",
          }),
        ],
        {
          rowOptions: {
            text: {
              bold: true,
            },
          },
          cellOptions: {
            padding: {
              x: 2,
              y: 1,
            },
          },
        }
      ),
      widths: [null, 28, 32, 32],
      cellOptions: {
        padding: {
          x: 2,
          y: 2,
        },
      },
      rows: invoice.items.map((item, i) => {
        const total = item.quantity * item.unitPrice;

        return ppTableRow(
          [
            !item.description
              ? ppText(item.name)
              : ppColumn([
                  ppText(item.name),
                  ppText(item.description, {
                    fontSize: 9,
                    textColor: "#728296",
                  }),
                ]),
            ppText(`${formatFloat(item.quantity, true)} ${item.unit}`),
            ppText(`${currency.format(item.unitPrice)}`),
            ppText(`${currency.format(total)}`, {
              width: { relative: 1 },
              align: "right",
            }),
          ],
          {
            rowOptions: {
              backgroundColor: i % 2 === 0 ? "#f3f7fc" : undefined,
            },
          }
        );
      }),
    });
  }

  function ppAddress(address: Address, title?: string) {
    const displayRows = getClientDisplayLines(address, t);
    const rows: PdfBlueprint[] = [];

    if (title) {
      rows.push(ppText(title, { bold: true }), ppSizedBox({ height: 2 }));
    }

    displayRows.forEach((row, i) => {
      if (!row) rows.push(ppSizedBox({ height: 2 }));
      else rows.push(ppText(row, { bold: i === 0 && !title }));
    });

    return ppColumn(rows);
  }

  const doc = new PdfDocument(ppInvoice(), {
    header: await ppHeader(),
    footer: ppFooter,
    page: {
      text: {
        fontFamily: "Roboto",
        textColor: "#334459",
      },
      div: {
        padding: {
          top: 10,
          bottom: 10,
          right: 10,
          left: 15,
        },
      },
    },
  });

  addAllRobotoFonts(doc);
  doc.build();

  return Buffer.from(doc.getJsPdf().output("arraybuffer"));
}
