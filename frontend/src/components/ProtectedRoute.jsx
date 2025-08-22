import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // If no token, redirect to auth
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // If specific role is required
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/auth" replace />;
  }

  // If allowed roles are specified
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
