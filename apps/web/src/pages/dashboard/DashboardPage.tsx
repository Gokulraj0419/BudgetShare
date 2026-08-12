import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import {
  AccountBalanceWalletOutlined,
  TrendingDownOutlined,
  TrendingUpOutlined,
  AddOutlined,
} from '@mui/icons-material';
import { useBudgetShare } from '../../context/BudgetShareContext';
import { calculateGroupTotal, formatCurrency } from '@budgetshare/utils';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { groups, getGroupStats } = useBudgetShare();
  const [currency, setCurrency] = useState('INR');

  // Aggregate all expenses across all groups
  const allExpenses = groups.flatMap((g) =>
    g.expenses.map((e) => ({
      ...e,
      groupName: g.name,
      groupId: g.id,
    }))
  );

  // Sort expenses by date descending
  const recentExpenses = [...allExpenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Sum up stats across all groups
  const totalStats = groups.reduce(
    (acc, g) => {
      const stats = getGroupStats(g.id);
      acc.owe += stats.youOwe;
      acc.get += stats.youGet;
      return acc;
    },
    { owe: 0, get: 0 }
  );

  const totalSpent = calculateGroupTotal(allExpenses);

  // Calculate category breakdown
  const categoryTotals: Record<string, number> = {};
  allExpenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const categories = Object.entries(categoryTotals).map(([category, amount]) => {
    const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
    return {
      category,
      amount,
      percentage,
      formattedAmount: formatCurrency(amount, currency),
    };
  });

  return (
    <Box sx={{ py: 2 }}>
      {/* Title Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Keep track of your shared budgets and personal expenses.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddOutlined />}
            onClick={() => navigate('/add-expense')}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
          >
            Add Expense
          </Button>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="currency-select-label">Currency</InputLabel>
            <Select
              labelId="currency-select-label"
              id="currency-select"
              value={currency}
              label="Currency"
              onChange={(e) => setCurrency(e.target.value)}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="USD">USD ($)</MenuItem>
              <MenuItem value="EUR">EUR (€)</MenuItem>
              <MenuItem value="GBP">GBP (£)</MenuItem>
              <MenuItem value="INR">INR (₹)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', width: 56, height: 56 }}>
                <AccountBalanceWalletOutlined />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Total Expenses
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {formatCurrency(totalSpent, currency)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', width: 56, height: 56 }}>
                <TrendingDownOutlined />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  You Owe
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444' }}>
                  {formatCurrency(totalStats.owe, currency)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: 56, height: 56 }}>
                <TrendingUpOutlined />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  You Receive
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981' }}>
                  {formatCurrency(totalStats.get, currency)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity & Category Breakdown */}
      <Grid container spacing={3}>
        {/* Table list */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Recent Transactions
            </Typography>
            {recentExpenses.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">No transactions recorded yet.</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Group</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentExpenses.map((expense) => (
                      <TableRow key={expense.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{expense.description}</TableCell>
                        <TableCell>{expense.groupName}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#334155' }}>
                          {formatCurrency(expense.amount, currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        {/* Breakdown percentage list */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Category Breakdown
            </Typography>
            {categories.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">No category data available.</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {categories.map((cat) => (
                  <Box key={cat.category}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                        {cat.category}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#4f46e5' }}>
                        {cat.formattedAmount} ({cat.percentage}%)
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#f1f5f9',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${cat.percentage}%`,
                          height: '100%',
                          backgroundColor: '#4f46e5',
                          borderRadius: 4,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
