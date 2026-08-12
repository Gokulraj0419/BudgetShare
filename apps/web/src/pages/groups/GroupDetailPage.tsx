import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  ArrowBackOutlined,
  AddOutlined,
  AccountBalanceWalletOutlined,
  TrendingUpOutlined,
  TrendingDownOutlined,
  ReceiptLongOutlined,
} from '@mui/icons-material';
import { useBudgetShare } from '../../context/BudgetShareContext';
import { formatCurrency } from '@budgetshare/utils';

export const GroupDetailPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { groups, getGroupStats } = useBudgetShare();

  const group = groups.find((g) => g.id === groupId);

  if (!group) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Group not found
        </Typography>
        <Button startIcon={<ArrowBackOutlined />} onClick={() => navigate('/groups')} variant="outlined">
          Back to Groups
        </Button>
      </Box>
    );
  }

  const stats = getGroupStats(group.id);

  return (
    <Box sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/groups')} color="primary">
            <ArrowBackOutlined />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
            {group.name}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={() => navigate(`/add-expense?groupId=${group.id}`)}
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
        >
          Add Expense
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', width: 52, height: 52 }}>
                <AccountBalanceWalletOutlined />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Total expenses
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {formatCurrency(stats.totalExpenses)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', width: 52, height: 52 }}>
                <TrendingDownOutlined />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  You owe
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444' }}>
                  {formatCurrency(stats.youOwe)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: 52, height: 52 }}>
                <TrendingUpOutlined />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  You receive
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981' }}>
                  {formatCurrency(stats.youGet)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detail Panels */}
      <Grid container spacing={3}>
        {/* Expenses List */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Expenses
            </Typography>

            {group.expenses.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  There are no expenses yet.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddOutlined />}
                  onClick={() => navigate(`/add-expense?groupId=${group.id}`)}
                  sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                  Add First Expense
                </Button>
              </Box>
            ) : (
              <List disablePadding>
                {group.expenses.map((expense, idx) => {
                  const partCount = expense.participants.filter((p) => p.selected).length;
                  return (
                    <React.Fragment key={expense.id}>
                      <ListItem sx={{ py: 2, px: 0 }}>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: '#e2e8f0', color: '#4f46e5' }}>
                            <ReceiptLongOutlined />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>
                              {expense.description}
                            </Typography>
                          }
                          secondary={`${expense.paidBy} paid • split with ${partCount} people • ${expense.category}`}
                        />
                        <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>
                          {formatCurrency(expense.amount)}
                        </Typography>
                      </ListItem>
                      {idx < group.expenses.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Members Panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Members ({group.members.length})
              </Typography>
              <Button size="small" startIcon={<AddOutlined />} sx={{ textTransform: 'none', fontWeight: 600 }}>
                Add Member
              </Button>
            </Box>

            <List disablePadding>
              {group.members.map((member, idx) => (
                <React.Fragment key={member}>
                  <ListItem sx={{ py: 1.5, px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.85rem', bgcolor: '#4f46e5' }}>
                        {member[0].toUpperCase()}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 600, color: '#334155' }}>
                          {member}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {idx < group.members.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
