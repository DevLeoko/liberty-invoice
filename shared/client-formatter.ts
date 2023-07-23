export function formatClientName(client: {
  name: string;
  firstName: string;
  lastName: string;
}) {
  return (
    client.name || `${client.firstName || ""} ${client.lastName || ""}`.trim()
  );
}
