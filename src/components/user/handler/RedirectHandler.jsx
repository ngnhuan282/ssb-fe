import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; 

const RedirectHandler = () => {
  const { pendingRedirect, clearPendingRedirect } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (pendingRedirect && pendingRedirect !== location.pathname) {
      console.log('🚀 Redirecting to:', pendingRedirect);
      navigate(pendingRedirect, { replace: true });
      clearPendingRedirect();
    }
  }, [pendingRedirect, navigate, clearPendingRedirect, location.pathname]);

  return null;
};

export default RedirectHandler;