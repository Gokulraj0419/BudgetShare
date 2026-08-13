import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/login/LoginPage';
import { RegisterPage } from '../pages/register/RegisterPage';
import { Layout } from '../components/Layout';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { GroupsPage } from '../pages/groups/GroupsPage';
import { GroupDetailPage } from '../pages/groups/GroupDetailPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { AddExpensePage } from '../pages/expense/AddExpensePage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/add-expense" element={<AddExpensePage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/groups/:groupId" element={<GroupDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
