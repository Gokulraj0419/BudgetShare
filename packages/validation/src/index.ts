import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP']),
  theme: z.enum(['Light', 'Dark']),
  language: z.enum(['English', 'Spanish', 'Tamil']),
});

export const groupSchema = z.object({
  name: z.string().min(1, { message: 'Group name is required' }),
  description: z.string().optional(),
  type: z.enum(['Trip', 'Home', 'Couple', 'Other']),
});

export const expenseSchema = z.object({
  description: z.string().min(1, { message: 'Description is required' }),
  amount: z.number().positive({ message: 'Amount must be greater than 0' }),
  category: z.string().min(1, { message: 'Category is required' }),
  date: z.string().min(1, { message: 'Date is required' }),
  paidBy: z.string().min(1, { message: 'Paid by is required' }),
  splitType: z.enum(['Equal', 'Percentage', 'Exact']),
});
