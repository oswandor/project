import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const API_URL_BASE = import.meta.env.VIRE_API_URL_BASE; // Usar variable de entorno para la URL


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL_BASE}/check-auth`, {
          method: 'GET',
          credentials: 'include', // Incluye cookies de sesión automáticamente
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Muestra un indicador de carga mientras se verifica la sesión
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
