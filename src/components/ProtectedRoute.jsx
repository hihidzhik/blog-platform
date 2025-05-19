import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  return children;
}

export default ProtectedRoute;
