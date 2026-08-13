import { create } from 'zustand';
import type { BudgetGroup, GroupExpense, UserProfile } from '@budgetshare/types';
import { WebStorageAdapter, type StorageAdapter } from '@budgetshare/storage';

interface BudgetStoreState {
  // Auth
  currentUser: string;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Groups
  groups: BudgetGroup[];
  createGroup: (name: string, description: string, type: string, members: string[]) => void;

  // Expenses
  addExpenseToGroup: (groupId: string, expense: Omit<GroupExpense, 'id'>) => void;

  // Profile
  profile: UserProfile;
  updateProfile: (profileData: UserProfile) => void;
}

const SEED_GROUPS: BudgetGroup[] = [
  {
    id: '1',
    name: 'Goa Trip',
    description: 'Trip expenses with friends',
    type: 'Trip',
    members: ['Gokul Raj', 'Arun', 'Praveen', 'Karthik'],
    expenses: [
      {
        id: '101',
        description: 'Hotel Booking',
        amount: 8000,
        category: 'Housing',
        date: '2026-08-11',
        paidBy: 'Gokul Raj',
        splitType: 'Equal',
        participants: [
          { name: 'Gokul Raj', selected: true, inputVal: '', calculatedShare: 2000 },
          { name: 'Arun', selected: true, inputVal: '', calculatedShare: 2000 },
          { name: 'Praveen', selected: true, inputVal: '', calculatedShare: 2000 },
          { name: 'Karthik', selected: true, inputVal: '', calculatedShare: 2000 },
        ],
      },
      {
        id: '102',
        description: 'Dinner at Beachfront',
        amount: 3000,
        category: 'Food',
        date: '2026-08-11',
        paidBy: 'Arun',
        splitType: 'Equal',
        participants: [
          { name: 'Gokul Raj', selected: true, inputVal: '', calculatedShare: 750 },
          { name: 'Arun', selected: true, inputVal: '', calculatedShare: 750 },
          { name: 'Praveen', selected: true, inputVal: '', calculatedShare: 750 },
          { name: 'Karthik', selected: true, inputVal: '', calculatedShare: 750 },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Roommates 2026',
    description: 'Shared house expenses',
    type: 'Home',
    members: ['Gokul Raj', 'Arun', 'Vijay'],
    expenses: [
      {
        id: '201',
        description: 'Internet Bill',
        amount: 1500,
        category: 'Utilities',
        date: '2026-08-01',
        paidBy: 'Gokul Raj',
        splitType: 'Equal',
        participants: [
          { name: 'Gokul Raj', selected: true, inputVal: '', calculatedShare: 500 },
          { name: 'Arun', selected: true, inputVal: '', calculatedShare: 500 },
          { name: 'Vijay', selected: true, inputVal: '', calculatedShare: 500 },
        ],
      },
    ],
  },
];

const DEFAULT_PROFILE: UserProfile = {
  name: 'Gokul Raj',
  email: 'gokul@example.com',
  currency: 'INR',
  theme: 'Light',
  language: 'English',
};

// Pluggable Storage Adapter (Defaults to WebStorageAdapter)
let storageAdapter: StorageAdapter = new WebStorageAdapter();

export function setStorageAdapter(adapter: StorageAdapter) {
  storageAdapter = adapter;
}

// Helper to get initial state from localStorage (synchronous fallback for initial state setup)
const getSavedStateSync = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const useBudgetStore = create<BudgetStoreState>((set) => ({
  // Auth State
  currentUser: getSavedStateSync('budget_store_current_user', 'Gokul Raj'),
  isAuthenticated: getSavedStateSync('budget_store_is_auth', true),

  login: async (email, password) => {
    set({ currentUser: 'Gokul Raj', isAuthenticated: true });
    await storageAdapter.setItem('budget_store_current_user', JSON.stringify('Gokul Raj'));
    await storageAdapter.setItem('budget_store_is_auth', JSON.stringify(true));
    return true;
  },

  register: async (name, email, password) => {
    set({ currentUser: name, isAuthenticated: true });
    await storageAdapter.setItem('budget_store_current_user', JSON.stringify(name));
    await storageAdapter.setItem('budget_store_is_auth', JSON.stringify(true));
    return true;
  },

  logout: () => {
    set({ currentUser: '', isAuthenticated: false });
    storageAdapter.removeItem('budget_store_current_user');
    storageAdapter.setItem('budget_store_is_auth', JSON.stringify(false));
  },

  // Groups State
  groups: getSavedStateSync('budget_share_groups', SEED_GROUPS),

  createGroup: (name, description, type, members) => {
    set((state) => {
      const currentUserVal = state.currentUser || 'Gokul Raj';
      const newGroup: BudgetGroup = {
        id: String(Date.now()),
        name,
        description,
        type,
        members: members.includes(currentUserVal) ? members : [currentUserVal, ...members],
        expenses: [],
      };
      const updatedGroups = [...state.groups, newGroup];
      storageAdapter.setItem('budget_share_groups', JSON.stringify(updatedGroups));
      return { groups: updatedGroups };
    });
  },

  addExpenseToGroup: (groupId, expenseData) => {
    set((state) => {
      const updatedGroups = state.groups.map((g) => {
        if (g.id !== groupId) return g;
        const newExpense: GroupExpense = {
          ...expenseData,
          id: String(Date.now()),
        };
        return {
          ...g,
          expenses: [...g.expenses, newExpense],
        };
      });
      storageAdapter.setItem('budget_share_groups', JSON.stringify(updatedGroups));
      return { groups: updatedGroups };
    });
  },

  // Profile State
  profile: getSavedStateSync('budget_store_profile', DEFAULT_PROFILE),
  updateProfile: (profileData) => {
    set({ profile: profileData, currentUser: profileData.name });
    storageAdapter.setItem('budget_store_profile', JSON.stringify(profileData));
    storageAdapter.setItem('budget_store_current_user', JSON.stringify(profileData.name));
  },
}));
