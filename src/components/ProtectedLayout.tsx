// src/components/ProtectedLayout.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    // Only redirect to auth if the route is explicitly wrapped by this layout
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}