import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};
