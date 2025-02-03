import React from 'react';
import { Navigate } from 'react-router-dom';

// Ruta protegida para roles específicos
interface ProtectedRouteProps {
  children: React.ReactNode;
  role: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  // Obtener los datos del usuario desde localStorage o un contexto global
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;

  // Verificar si el usuario tiene el rol adecuado
  if (!user || user.rol !== role) {
    // Si no tiene acceso, redirigir a la página principal
    return <Navigate to="/" replace />;
  }

  // Renderizar el contenido protegido
  return children;
};

export default ProtectedRoute;
