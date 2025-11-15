// src/components/user/handler/RedirectHandler.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; 

const RedirectHandler = () => {
  const { redirectAfterLogin, setRedirectAfterLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (redirectAfterLogin) {
      navigate(redirectAfterLogin, { replace: true });
      setRedirectAfterLogin(null);
    }
  }, [redirectAfterLogin, navigate, setRedirectAfterLogin]);

  return null;
};

export default RedirectHandler; 