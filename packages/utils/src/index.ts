export function calculateEqualSplit(amount: number, members: string[]): Record<string, number> {
  if (members.length === 0) return {};
  const share = parseFloat((amount / members.length).toFixed(2));
  const splits: Record<string, number> = {};
  members.forEach((m) => {
    splits[m] = share;
  });
  return splits;
}

export function calculatePercentageSplit(
  amount: number,
  shares: { name: string; percentage: number }[]
): Record<string, number> {
  const splits: Record<string, number> = {};
  shares.forEach((s) => {
    splits[s.name] = parseFloat(((amount * s.percentage) / 100).toFixed(2));
  });
  return splits;
}

export function calculateExactSplit(
  amount: number,
  shares: { name: string; exactAmount: number }[]
): Record<string, number> {
  const splits: Record<string, number> = {};
  shares.forEach((s) => {
    splits[s.name] = parseFloat(s.exactAmount.toFixed(2));
  });
  return splits;
}

export function calculateGroupTotal(expenses: { amount: number }[]): number {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
}
