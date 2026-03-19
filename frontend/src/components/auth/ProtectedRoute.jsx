import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Wrap any page that requires login with this component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent 
                        rounded-full animate-spin" />
      </div>
    );
  }

  // If not logged in, redirect to login page
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;