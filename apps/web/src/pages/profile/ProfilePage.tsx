import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '@budgetshare/validation';
import type { UserProfile } from '@budgetshare/types';
import { useBudgetStore } from '@budgetshare/store';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
  TextField,
  MenuItem,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import {
  PersonOutlined,
  EmailOutlined,
  SettingsOutlined,
  PaletteOutlined,
  LanguageOutlined,
  LogoutOutlined,
  SaveOutlined,
} from '@mui/icons-material';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const profile = useBudgetStore((state) => state.profile);
  const updateProfile = useBudgetStore((state) => state.updateProfile);


  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserProfile>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });


  const nameVal = watch('name') || 'Gokul Raj';
  const emailVal = watch('email') || 'gokul@example.com';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const onSubmit = (data: UserProfile) => {
    updateProfile(data);
    setSuccessMsg('Profile settings saved successfully!');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <Box sx={{ py: 2, maxWidth: 650, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 4 }}>
        Profile
      </Typography>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {successMsg}
        </Alert>
      )}

      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
          border: '1px solid #f1f5f9',
        }}
      >
        {/* Profile Header section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 90,
              height: 90,
              bgcolor: '#4f46e5',
              fontSize: '2.25rem',
              fontWeight: 700,
              mb: 2,
              boxShadow: '0 8px 16px rgba(79, 70, 229, 0.15)',
            }}
          >
            {getInitials(nameVal)}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
            {nameVal}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {emailVal}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Account - Personal Info */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#4f46e5', mb: 1 }}>
                Account & Personal Information
              </Typography>
            </Grid>

            {/* Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Full Name *"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    slotProps={{
                      input: {
                        startAdornment: <PersonOutlined sx={{ mr: 1, color: 'text.secondary' }} />,
                      },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                )}
              />
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email Address *"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    slotProps={{
                      input: {
                        startAdornment: <EmailOutlined sx={{ mr: 1, color: 'text.secondary' }} />,
                      },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                )}
              />
            </Grid>

            {/* App Settings */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ mt: 2 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#4f46e5', mb: 1 }}>
                Application Preferences
              </Typography>
            </Grid>

            {/* Currency */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Currency"
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: <SettingsOutlined sx={{ mr: 1, color: 'text.secondary' }} />,
                      },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  >
                    <MenuItem value="INR">INR (₹)</MenuItem>
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {/* Theme */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="theme"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Theme"
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: <PaletteOutlined sx={{ mr: 1, color: 'text.secondary' }} />,
                      },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  >
                    <MenuItem value="Light">Light</MenuItem>
                    <MenuItem value="Dark">Dark</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {/* Language */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Language"
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: <LanguageOutlined sx={{ mr: 1, color: 'text.secondary' }} />,
                      },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  >
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Spanish">Spanish</MenuItem>
                    <MenuItem value="Tamil">Tamil</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ my: 4, borderTop: '1px solid #f1f5f9' }} />

          {/* Form Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              startIcon={<LogoutOutlined />}
              sx={{ py: 1.2, px: 3, borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
            >
              Logout
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveOutlined />}
              sx={{ py: 1.2, px: 3, borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
            >
              Save Settings
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
