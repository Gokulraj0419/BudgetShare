export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ParticipantShare {
  name: string;
  selected: boolean;
  inputVal: string;
  calculatedShare: number;
}

export interface GroupExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  paidBy: string;
  splitType: 'Equal' | 'Percentage' | 'Exact';
  participants: ParticipantShare[];
}

export interface BudgetGroup {
  id: string;
  name: string;
  description: string;
  type: string;
  members: string[];
  expenses: GroupExpense[];
}

export interface UserProfile {
  name: string;
  email: string;
  currency: string;
  theme: string;
  language: string;
}
