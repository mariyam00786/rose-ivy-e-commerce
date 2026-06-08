import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user && user.isAdmin ? children : <Navigate to="/login" replace />;
}
