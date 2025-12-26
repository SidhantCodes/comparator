// src/components/ProtectedLayout.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedLayoutProps {
  requiredRole?: string;
}

export function ProtectedLayout({ requiredRole }: ProtectedLayoutProps) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />; // Redirect non-admins to home
  }

  return <Outlet />;
}