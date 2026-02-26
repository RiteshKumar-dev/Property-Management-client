import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, authentication = true }) {
  const token = localStorage.getItem('token');

  if (authentication && !token) {
    return <Navigate to="/login" replace />;
  }

  if (!authentication && token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
