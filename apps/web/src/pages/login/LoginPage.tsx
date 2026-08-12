import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';
import { useBudgetStore } from '@budgetshare/store';
import { LoginForm } from '../../components/LoginForm';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useBudgetStore((state) => state.login);

  const handleLoginSubmit = async (email: string, password: string) => {
    await login(email, password);
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 5 },
          width: '100%',
          maxWidth: 440,
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Custom Blue Jar / Money bag Logo */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -4,
              width: 24,
              height: 8,
              borderRadius: '3px',
              backgroundColor: '#3b82f6',
            }
          }}
        >
          {/* Logo inner detail */}
          <Box sx={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#fff', opacity: 0.8 }} />
        </Box>

        <Typography
          variant="h4"
          component="h1"
          align="center"
          sx={{
            fontWeight: 800,
            color: '#4f46e5',
            mb: 1,
            letterSpacing: '-0.5px',
          }}
        >
          Smart Expense Tracker
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4, fontWeight: 500 }}
        >
          Sign in to your account
        </Typography>

        <LoginForm
          onSubmit={handleLoginSubmit}
          onNavigateToRegister={() => navigate('/register')}
        />
      </Paper>
    </Box>
  );
};
