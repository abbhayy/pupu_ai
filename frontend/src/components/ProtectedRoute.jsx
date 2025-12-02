import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute - Redirects to login if user is not authenticated
 * @param {Object} props - Component props
 * @param {React.Component} props.children - Child component to render if authenticated
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists, render children
  return children;
}

export default ProtectedRoute;
