export type NestSignal = "BUY" | "SELL" | "NEUTRAL";

export interface NestResult {
  signal: NestSignal;
  conditionText: string;
}

export function calculateNest(
  openToday: number,
  previousClose: number
): NestResult {
  if (openToday > previousClose) {
    return {
      signal: "SELL",
      conditionText: `Today's open is above the previous close.`,
    };
  }

  if (openToday < previousClose) {
    return {
      signal: "BUY",
      conditionText: `Today's open is below the previous close.`,
    };
  }

  return {
    signal: "NEUTRAL",
    conditionText: `Today's open is equal to the previous close.`,
  };
}