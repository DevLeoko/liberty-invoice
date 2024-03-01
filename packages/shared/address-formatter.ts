export interface ClientDetails extends Address {
  name: string;
  shorthand: string;
  additionalLine: string;
  firstName: string;
  lastName: string;
  contactPhone: string;
  contactEmail: string;
  vatNumber: string;
}

export interface Address {
  street: string;
  streetNumber?: string;
  city: string;
  zip: string;
  countryCode: string;
}

type TranslationFunction = (
  key: "invoice.asFreelancer" | "invoice.vatId" | "countries.US"
) => string;

export function getClientDisplayLines(
  client: ClientDetails,
  t: TranslationFunction
) {
  const lines: string[] = [];
  if (client.name) {
    lines.push(client.name);
  }
  if (client.additionalLine) {
    lines.push(
      t(client.additionalLine as "invoice.asFreelancer") ||
        client.additionalLine
    );
  }
  if (client.firstName || client.lastName) {
    if (client.name) {
      lines.push("");
    }

    lines.push(`${client.firstName || ""} ${client.lastName || ""}`.trim());
  }
  lines.push(...getAddressDisplayLines(client, t));
  if (client.vatNumber || client.contactPhone || client.contactEmail) {
    lines.push("");
  }
  if (client.vatNumber) {
    lines.push(`${t("invoice.vatId")}: ${client.vatNumber}`);
  }
  if (client.contactPhone) {
    lines.push(client.contactPhone);
  }
  if (client.contactEmail) {
    lines.push(client.contactEmail);
  }
  return lines;
}

export function getAddressDisplayLines(
  address: Address,
  t: TranslationFunction
): string[] {
  const lines: string[] = [];
  if (address.street) {
    lines.push(`${address.street} ${address.streetNumber || ""}`.trim());
  }
  if (address.city || address.zip) {
    lines.push(`${address.zip || ""} ${address.city || ""}`.trim());
  }
  if (address.countryCode) {
    lines.push(t(`countries.${address.countryCode as "US"}`));
  }
  return lines;
}
