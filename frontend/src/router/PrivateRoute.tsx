import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/layout/Spinner/Spinner';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return (
    <div className='min-h-32 md:min-h-48 flex items-center justify-center'>
      <Spinner />
    </div>
    
  );

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;