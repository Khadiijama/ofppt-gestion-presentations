import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="loader" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'formateur' ? '/formateur' : '/stagiaire'} replace />;
  }

  return children;
};

export default ProtectedRoute;
