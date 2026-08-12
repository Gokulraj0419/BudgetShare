import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { groupSchema } from '@budgetshare/validation';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
} from '@mui/material';
import { ArrowForwardOutlined, CloseOutlined, AddOutlined } from '@mui/icons-material';
import { useBudgetShare } from '../../context/BudgetShareContext';

interface CreateGroupFormInput {
  name: string;
  description?: string;
  type: 'Trip' | 'Home' | 'Couple' | 'Other';
}

const GLOBAL_MEMBERS_POOL = ['Arun', 'Praveen', 'Karthik', 'Vijay'];
const GROUP_TYPES = ['Trip', 'Home', 'Couple', 'Other'];

export const GroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const { groups, createGroup, getGroupStats } = useBudgetShare();
  const [openModal, setOpenModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>(GLOBAL_MEMBERS_POOL);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGroupFormInput>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'Trip',
    },
  });

  const handleOpenModal = () => {
    reset();
    setSelectedMembers(GLOBAL_MEMBERS_POOL);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleMemberToggle = (member: string) => {
    setSelectedMembers((prev) =>
      prev.includes(member) ? prev.filter((m) => m !== member) : [...prev, member]
    );
  };

  const onSubmitGroup = (data: CreateGroupFormInput) => {
    createGroup(data.name, data.description || '', data.type, selectedMembers);
    setOpenModal(false);
  };

  return (
    <Box sx={{ py: 2 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
            Groups
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your shared expense groups and split bills with friends.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={handleOpenModal}
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
        >
          Create Group
        </Button>
      </Box>

      {/* Groups Grid */}
      <Grid container spacing={3}>
        {groups.map((group) => {
          const stats = getGroupStats(group.id);
          const oweNet = stats.youOwe - stats.youGet;
          const getNet = stats.youGet - stats.youOwe;

          return (
            <Grid size={{ xs: 12, md: 6 }} key={group.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {group.name}
                    </Typography>
                    <Chip
                      label={group.type}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: '6px', fontWeight: 600 }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {group.description || 'No description provided.'}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#64748b' }}>
                      Members: <strong>{group.members.length} members</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#64748b' }}>
                      Total expenses: <strong>₹{stats.totalExpenses.toLocaleString('en-IN')}</strong>
                    </Typography>
                  </Box>

                  {/* Net Balances display */}
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px dotted #e2e8f0' }}>
                    {oweNet > 0 ? (
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#ef4444' }}>
                        You owe ₹{oweNet.toLocaleString('en-IN')}
                      </Typography>
                    ) : getNet > 0 ? (
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981' }}>
                        You receive ₹{getNet.toLocaleString('en-IN')}
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748b' }}>
                        No balance / Settled up
                      </Typography>
                    )}
                  </Box>
                </CardContent>

                <CardActions sx={{ borderTop: '1px solid #f1f5f9', px: 2, py: 1.5, justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    endIcon={<ArrowForwardOutlined />}
                    onClick={() => navigate(`/groups/${group.id}`)}
                    sx={{ fontWeight: 600 }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Create Group Dialog Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth sx={{ '& .MuiPaper-root': { borderRadius: 4 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
          Create Group
          <IconButton onClick={handleCloseModal} size="small">
            <CloseOutlined />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmitGroup)}>
          <DialogContent dividers>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Group name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Group name *"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Group type"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    >
                      {GROUP_TYPES.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#4f46e5' }}>
                  Add members
                </Typography>
                <FormGroup>
                  {GLOBAL_MEMBERS_POOL.map((member) => (
                    <FormControlLabel
                      key={member}
                      control={
                        <Checkbox
                          checked={selectedMembers.includes(member)}
                          onChange={() => handleMemberToggle(member)}
                        />
                      }
                      label={member}
                    />
                  ))}
                </FormGroup>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary', fontWeight: 600 }}>
                  Selected members: {selectedMembers.length}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseModal} sx={{ textTransform: 'none', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px' }}
            >
              Create Group
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
