import React, { createContext, useContext } from 'react';
import type { GroupExpense, BudgetGroup } from '@budgetshare/types';
import { useBudgetStore } from '@budgetshare/store';

interface BudgetShareContextProps {
  groups: BudgetGroup[];
  currentUser: string;
  createGroup: (name: string, description: string, type: string, members: string[]) => void;
  addExpenseToGroup: (groupId: string, expense: Omit<GroupExpense, 'id'>) => void;
  getGroupStats: (groupId: string) => { totalExpenses: number; youOwe: number; youGet: number };
}

const BudgetShareContext = createContext<BudgetShareContextProps | undefined>(undefined);

export const BudgetShareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const groups = useBudgetStore((state) => state.groups);
  const currentUser = useBudgetStore((state) => state.currentUser);
  const createGroup = useBudgetStore((state) => state.createGroup);
  const addExpenseToGroup = useBudgetStore((state) => state.addExpenseToGroup);

  const getGroupStats = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return { totalExpenses: 0, youOwe: 0, youGet: 0 };

    let totalExpenses = 0;
    let youOwe = 0;
    let youGet = 0;

    group.expenses.forEach((exp) => {
      totalExpenses += exp.amount;

      if (exp.paidBy === currentUser) {
        // Logged in user paid. Others owe user their calculated share
        exp.participants.forEach((part) => {
          if (part.name !== currentUser && part.selected) {
            youGet += part.calculatedShare;
          }
        });
      } else {
        // Someone else paid. User might owe them
        const userPart = exp.participants.find((part) => part.name === currentUser);
        if (userPart && userPart.selected) {
          youOwe += userPart.calculatedShare;
        }
      }
    });

    return { totalExpenses, youOwe, youGet };
  };

  return (
    <BudgetShareContext.Provider value={{ groups, currentUser, createGroup, addExpenseToGroup, getGroupStats }}>
      {children}
    </BudgetShareContext.Provider>
  );
};

export const useBudgetShare = () => {
  const context = useContext(BudgetShareContext);
  if (!context) {
    throw new Error('useBudgetShare must be used within a BudgetShareProvider');
  }
  return context;
};
