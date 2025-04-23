import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

const PublicRoute: React.FC = () => {

  // hooks
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return <Outlet />;
};

export default PublicRoute;