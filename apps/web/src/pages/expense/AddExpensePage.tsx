import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema } from '@budgetshare/validation';
import {
  calculateEqualSplit,
  calculatePercentageSplit,
  calculateExactSplit,
} from '@budgetshare/utils';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Checkbox,
  FormControlLabel,
  Alert,
  IconButton,
} from '@mui/material';
import { CloseOutlined, CalendarTodayOutlined } from '@mui/icons-material';
import { useBudgetShare } from '../../context/BudgetShareContext';

interface Participant {
  name: string;
  checked: boolean;
  value: string; // holds percentage or exact amount input
}

interface ExpenseFormInput {
  description: string;
  amount: number;
  category: string;
  date: string;
  paidBy: string;
  splitType: 'Equal' | 'Percentage' | 'Exact';
}

const CATEGORIES = [
  { value: 'Food', label: '🍔 Food' },
  { value: 'Housing', label: '🏠 Housing' },
  { value: 'Utilities', label: '⚡ Utilities' },
  { value: 'Transportation', label: '🚗 Transportation' },
  { value: 'Entertainment', label: '🎉 Entertainment' },
];

export const AddExpensePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { groups, addExpenseToGroup, currentUser } = useBudgetShare();

  // Extract groupId from URL search query
  const queryParams = new URLSearchParams(location.search);
  const urlGroupId = queryParams.get('groupId');

  // Fallback to first group if no urlGroupId is specified
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    urlGroupId || (groups[0] ? groups[0].id : '')
  );

  const activeGroup = groups.find((g) => g.id === selectedGroupId);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [splitError, setSplitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormInput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      amount: 0,
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      paidBy: currentUser,
      splitType: 'Equal',
    },
  });

  const amount = watch('amount') || 0;
  const splitType = watch('splitType');

  // Update participants list and paidBy whenever selected group changes
  useEffect(() => {
    if (activeGroup) {
      setParticipants(
        activeGroup.members.map((m) => ({ name: m, checked: true, value: '' }))
      );
      // Default Paid By to current user if they are in the group, else first member
      const hasCurrentUser = activeGroup.members.includes(currentUser);
      setValue('paidBy', hasCurrentUser ? currentUser : activeGroup.members[0]);
    }
  }, [selectedGroupId, groups, setValue, currentUser]);

  // Trigger calculations when amount, splitType, or participants' checks change
  useEffect(() => {
    if (participants.length === 0) return;

    const checkedParticipants = participants.filter((p) => p.checked);
    const checkedCount = checkedParticipants.length;
    if (checkedCount === 0) {
      setSplitError('At least one participant must be selected');
      return;
    }

    if (splitType === 'Equal') {
      setSplitError(null);
      const splitResults = calculateEqualSplit(amount, checkedParticipants.map(p => p.name));
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          value: p.checked ? (splitResults[p.name] || 0).toFixed(2) : '0.00',
        }))
      );
    } else if (splitType === 'Percentage') {
      setParticipants((prev) =>
        prev.map((p) => {
          if (!p.checked) return { ...p, value: '0' };
          const initialPct = Math.round(100 / checkedCount);
          return { ...p, value: p.value && p.value !== '0.00' && p.value !== '0' ? p.value : String(initialPct) };
        })
      );
    } else if (splitType === 'Exact') {
      setParticipants((prev) =>
        prev.map((p) => {
          if (!p.checked) return { ...p, value: '0' };
          const share = amount / checkedCount;
          return { ...p, value: p.value && p.value !== '0.00' && p.value !== '0' ? p.value : share.toFixed(2) };
        })
      );
    }
  }, [amount, splitType, participants.length]);

  // Recalculate and validate percentages / exact amounts
  useEffect(() => {
    if (splitType === 'Equal') {
      setSplitError(null);
      return;
    }

    const checkedCount = participants.filter((p) => p.checked).length;
    if (checkedCount === 0) {
      setSplitError('At least one participant must be selected');
      return;
    }

    if (splitType === 'Percentage') {
      const totalPct = participants
        .filter((p) => p.checked)
        .reduce((sum, p) => sum + (parseFloat(p.value) || 0), 0);
      if (Math.round(totalPct) !== 100) {
        setSplitError(`Total percentage must equal 100% (Currently ${totalPct}%)`);
      } else {
        setSplitError(null);
      }
    } else if (splitType === 'Exact') {
      const totalExact = participants
        .filter((p) => p.checked)
        .reduce((sum, p) => sum + (parseFloat(p.value) || 0), 0);
      if (Math.abs(totalExact - amount) > 0.01) {
        setSplitError(
          `Split amount (₹${totalExact.toFixed(2)}) must equal expense amount (₹${amount.toFixed(2)})`
        );
      } else {
        setSplitError(null);
      }
    }
  }, [participants, splitType, amount]);

  const handleCheckboxChange = (index: number) => {
    setParticipants((prev) => {
      const updated = [...prev];
      updated[index].checked = !updated[index].checked;
      if (!updated[index].checked) {
        updated[index].value = '0';
      } else {
        updated[index].value = ''; // reset to trigger calculation in useEffect
      }
      return updated;
    });
  };

  const handleParticipantValueChange = (index: number, val: string) => {
    setParticipants((prev) => {
      const updated = [...prev];
      updated[index].value = val;
      return updated;
    });
  };

  const onSubmit = (data: ExpenseFormInput) => {
    if (splitError || !selectedGroupId) return;

    let splitsMap: Record<string, number> = {};
    if (splitType === 'Equal') {
      splitsMap = calculateEqualSplit(amount, participants.filter((p) => p.checked).map((p) => p.name));
    } else if (splitType === 'Percentage') {
      splitsMap = calculatePercentageSplit(
        amount,
        participants.map((p) => ({ name: p.name, percentage: p.checked ? parseFloat(p.value) || 0 : 0 }))
      );
    } else if (splitType === 'Exact') {
      splitsMap = calculateExactSplit(
        amount,
        participants.map((p) => ({ name: p.name, exactAmount: p.checked ? parseFloat(p.value) || 0 : 0 }))
      );
    }

    const formattedParticipants = participants.map((p) => {
      return {
        name: p.name,
        selected: p.checked,
        inputVal: p.value,
        calculatedShare: splitsMap[p.name] || 0,
      };
    });

    const expenseObject = {
      description: data.description,
      amount: data.amount,
      category: data.category,
      date: data.date,
      paidBy: data.paidBy,
      splitType: data.splitType,
      participants: formattedParticipants,
    };

    addExpenseToGroup(selectedGroupId, expenseObject);
    navigate(`/groups/${selectedGroupId}`);
  };

  if (!activeGroup) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Please create a budget group first before adding expenses.
        </Typography>
        <Button onClick={() => navigate('/groups')} variant="contained">
          Go to Groups
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2, maxWidth: 600, mx: 'auto' }}>
      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          position: 'relative',
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
            Add Expense
          </Typography>
          <IconButton onClick={() => navigate(urlGroupId ? `/groups/${urlGroupId}` : '/dashboard')} size="small">
            <CloseOutlined />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2.5}>
            {/* Group Selector */}
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                label="Group"
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                disabled={!!urlGroupId} // Lock group selector if navigated from a specific group
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              >
                {groups.map((g) => (
                  <MenuItem key={g.id} value={g.id}>
                    {g.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <Controller
                name="description"
                control={control}
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description *"
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Dinner at Restaurant"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                )}
              />
            </Grid>

            {/* Amount */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Amount *"
                    type="number"
                    fullWidth
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <Typography sx={{ mr: 1, fontWeight: 700, color: 'text.secondary' }}>₹</Typography>
                        ),
                      },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                )}
              />
            </Grid>

            {/* Category */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Category *"
                    fullWidth
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  >
                    {CATEGORIES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Date */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="date"
                control={control}
                rules={{ required: 'Date is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date *"
                    type="date"
                    fullWidth
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: {
                        endAdornment: <CalendarTodayOutlined color="action" fontSize="small" />,
                      },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                )}
              />
            </Grid>

            {/* Paid By */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="paidBy"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Paid by *"
                    fullWidth
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  >
                    {activeGroup.members.map((member) => (
                      <MenuItem key={member} value={member}>
                        {member}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ my: 3.5, borderTop: '1px solid #f1f5f9' }} />

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#4f46e5' }}>
            Split expense
          </Typography>

          {/* Split Type Toggle */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
              Split type *
            </Typography>
            <Controller
              name="splitType"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup
                  {...field}
                  exclusive
                  onChange={(_e, val) => {
                    if (val) {
                      field.onChange(val);
                    }
                  }}
                  color="primary"
                  sx={{ width: '100%' }}
                >
                  <ToggleButton value="Equal" sx={{ flexGrow: 1, borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>
                    Equal
                  </ToggleButton>
                  <ToggleButton value="Percentage" sx={{ flexGrow: 1, textTransform: 'none', fontWeight: 600 }}>
                    Percentage
                  </ToggleButton>
                  <ToggleButton value="Exact" sx={{ flexGrow: 1, borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>
                    Exact
                  </ToggleButton>
                </ToggleButtonGroup>
              )}
            />
          </Box>

          {/* Split Members List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Members
            </Typography>

            {participants.map((p, idx) => (
              <Box
                key={p.name}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: p.checked ? '#f8fafc' : '#f1f5f9',
                  border: '1px solid',
                  borderColor: p.checked ? '#e2e8f0' : 'transparent',
                  opacity: p.checked ? 1 : 0.6,
                  transition: 'all 0.2s',
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={p.checked}
                      onChange={() => handleCheckboxChange(idx)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 600, color: '#334155' }}>
                      {p.name}
                    </Typography>
                  }
                  sx={{ m: 0 }}
                />

                {/* Dynamically display share based on mode */}
                {p.checked ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {splitType === 'Equal' && (
                      <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>
                        ₹{(parseFloat(p.value) || 0).toFixed(2)}
                      </Typography>
                    )}

                    {splitType === 'Percentage' && (
                      <TextField
                        type="number"
                        size="small"
                        value={p.value}
                        onChange={(e) => handleParticipantValueChange(idx, e.target.value)}
                        slotProps={{
                          input: {
                            endAdornment: <Typography sx={{ ml: 0.5, fontWeight: 700 }}>%</Typography>,
                          },
                        }}
                        sx={{
                          width: 100,
                          '& .MuiOutlinedInput-root': { borderRadius: '6px' },
                        }}
                      />
                    )}

                    {splitType === 'Exact' && (
                      <TextField
                        type="number"
                        size="small"
                        value={p.value}
                        onChange={(e) => handleParticipantValueChange(idx, e.target.value)}
                        slotProps={{
                          input: {
                            startAdornment: <Typography sx={{ mr: 0.5, fontWeight: 700 }}>₹</Typography>,
                          },
                        }}
                        sx={{
                          width: 120,
                          '& .MuiOutlinedInput-root': { borderRadius: '6px' },
                        }}
                      />
                    )}
                  </Box>
                ) : (
                  <Typography color="text.disabled" sx={{ fontWeight: 500 }}>
                    Excluded
                  </Typography>
                )}
              </Box>
            ))}
          </Box>

          {/* Validation Warnings / Total metrics */}
          {splitError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {splitError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Total: ₹{amount.toFixed(2)}
            </Typography>
            {splitType === 'Percentage' && (
              <Typography variant="body2" sx={{ fontWeight: 700, color: splitError ? 'error.main' : 'success.main' }}>
                Total split: {participants.filter((p) => p.checked).reduce((sum, p) => sum + (parseFloat(p.value) || 0), 0)}%
              </Typography>
            )}
            {splitType === 'Exact' && (
              <Typography variant="body2" sx={{ fontWeight: 700, color: splitError ? 'error.main' : 'success.main' }}>
                Total split: ₹{participants.filter((p) => p.checked).reduce((sum, p) => sum + (parseFloat(p.value) || 0), 0).toFixed(2)}
              </Typography>
            )}
          </Box>

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(urlGroupId ? `/groups/${urlGroupId}` : '/dashboard')}
              sx={{ py: 1.2, px: 3, borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!!splitError}
              sx={{ py: 1.2, px: 3, borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
            >
              Add Expense
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
