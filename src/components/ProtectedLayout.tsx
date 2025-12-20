import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Header } from './Header';

export function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) return null; // Or spinner

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
