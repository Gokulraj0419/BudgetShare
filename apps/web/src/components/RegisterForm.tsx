import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@budgetshare/validation';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  EmailOutlined,
  LockOutlined,
  PersonOutlined,
  Visibility,
  VisibilityOff,
  PersonAddOutlined,
} from '@mui/icons-material';

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => void;
  onNavigateToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, onNavigateToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onFormSubmit = (data: any) => {
    onSubmit(data.name, data.email, data.password);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate sx={{ mt: 1, width: '100%' }}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            autoFocus
            error={!!errors.name}
            helperText={errors.name?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlined color={errors.name ? 'error' : 'action'} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            error={!!errors.email}
            helperText={errors.email?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined color={errors.email ? 'error' : 'action'} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color={errors.password ? 'error' : 'action'} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
        )}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        startIcon={<PersonAddOutlined />}
        sx={{
          py: 1.5,
          borderRadius: '8px',
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 600,
          backgroundColor: '#ff5c5c',
          '&:hover': {
            backgroundColor: '#e04e4e',
          },
          boxShadow: '0 4px 12px rgba(255, 92, 92, 0.2)',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        Register
      </Button>

      <Button
        fullWidth
        variant="outlined"
        onClick={onNavigateToLogin}
        sx={{
          mt: 2,
          py: 1.5,
          borderRadius: '8px',
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 600,
          borderColor: '#e0e0e0',
          color: '#666',
          backgroundColor: '#f9f9f9',
          '&:hover': {
            borderColor: '#ccc',
            backgroundColor: '#f0f0f0',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        Back to Login
      </Button>
    </Box>
  );
};
