
export const APP_INFO = {
  name: "BudgetShare",
  version: "1.0.0",
  tagline: "Shared Budget & Expense Tracking for Web & Mobile",
  supportedCurrencies: ["USD", "EUR", "GBP", "INR"],
};


export function formatCurrency(amount: number, currency: string = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
}

export interface BudgetSummary {
  total: number;
  categories: Array<{
    category: string;
    amount: number;
    percentage: number;
    formattedAmount: string;
  }>;
  topCategory: string;
}

export function calculateBudgetSummary(expenses: ExpenseItem[], currency: string = "USD"): BudgetSummary {
  if (!expenses || expenses.length === 0) {
    return {
      total: 0,
      categories: [],
      topCategory: "None",
    };
  }

  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  const categoryTotals: Record<string, number> = {};
  for (const item of expenses) {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
  }

  let highestAmount = -1;
  let topCategory = "None";

  const categories = Object.entries(categoryTotals).map(([cat, amt]) => {
    if (amt > highestAmount) {
      highestAmount = amt;
      topCategory = cat;
    }
    const pct = total > 0 ? (amt / total) * 100 : 0;
    return {
      category: cat,
      amount: amt,
      percentage: Math.round(pct * 10) / 10,
      formattedAmount: formatCurrency(amt, currency),
    };
  });

  return {
    total,
    categories,
    topCategory,
  };
}

/**
 * Common Greeting Generator
 */
export function getAppGreeting(platformName: string): string {
  return `Welcome to ${APP_INFO.name} v${APP_INFO.version} on ${platformName}!`;
}
