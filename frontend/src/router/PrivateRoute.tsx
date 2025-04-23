import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/layout/Spinner/Spinner';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Spinner />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;