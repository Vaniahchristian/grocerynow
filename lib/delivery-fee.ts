export function getDeliveryFee(location: string): number {
  const loc = (location || "").trim().toLowerCase();
  switch (loc) {
    case "kampala central":
      return 7000;
    case "wakiso":
      return 10000;
    default:
      return 10000; // default fee for other areas
  }
}
