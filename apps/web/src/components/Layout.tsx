import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Button,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Map pathnames to tab index
  const getTabIndex = () => {
    if (location.pathname.startsWith('/dashboard')) return 0;
    if (location.pathname.startsWith('/groups')) return 1;
    if (location.pathname.startsWith('/profile')) return 2;
    return 0;
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) navigate('/dashboard');
    if (newValue === 1) navigate('/groups');
    if (newValue === 2) navigate('/profile');
  };

  const handleLogout = () => {
    // Perform any logout operations here
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', bg: '#f5f7fa' }}>
      <AppBar position="sticky" color="inherit" elevation={1} sx={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo and Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
              {/* Custom Blue Jar / Money bag Logo */}
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    width: 14,
                    height: 4,
                    borderRadius: '2px',
                    backgroundColor: '#3b82f6',
                  }
                }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#fff', opacity: 0.8 }} />
              </Box>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                  color: '#4f46e5',
                }}
              >
                BudgetShare
              </Typography>
            </Box>

            {/* Middle Nav Tabs */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Tabs
                value={getTabIndex()}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Dashboard" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' }} />
                <Tab label="Groups" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' }} />
                <Tab label="Profile" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' }} />
              </Tabs>
            </Box>

            {/* Logout/User Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {/* Mobile-only Tabs alternative */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
                <Button size="small" onClick={() => navigate('/dashboard')} sx={{ minWidth: 0, px: 1, fontWeight: getTabIndex() === 0 ? 700 : 500 }}>
                  Home
                </Button>
                <Button size="small" onClick={() => navigate('/groups')} sx={{ minWidth: 0, px: 1, fontWeight: getTabIndex() === 1 ? 700 : 500 }}>
                  Groups
                </Button>
                <Button size="small" onClick={() => navigate('/profile')} sx={{ minWidth: 0, px: 1, fontWeight: getTabIndex() === 2 ? 700 : 500 }}>
                  Profile
                </Button>
              </Box>

              <IconButton onClick={handleLogout} color="error" title="Logout">
                <LogoutOutlined />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};
