import { Navigate } from 'react-router-dom';
import { useAuth } from '../Middleware/AuthContext';

const PublicRoute = ({ children }) => {
  const { accessToken, loading } = useAuth();

  if (loading) return null;

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;