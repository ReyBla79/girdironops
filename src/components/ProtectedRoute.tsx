import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredFlag?: string;
}

const ProtectedRoute = ({ children, requiredFlag }: ProtectedRouteProps) => {
  const { demoAuthed, flags } = useAppStore();

  if (!demoAuthed) {
    return <Navigate to="/login" replace />;
  }

  if (requiredFlag && !flags[requiredFlag as keyof typeof flags]) {
    return <Navigate to="/app/upgrade" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
