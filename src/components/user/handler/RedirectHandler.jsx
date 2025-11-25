import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; 

const RedirectHandler = () => {
  const { pendingRedirect, clearPendingRedirect } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Chỉ redirect khi pendingRedirect có giá trị và KHÁC với url hiện tại
    if (pendingRedirect && pendingRedirect !== location.pathname) {
      console.log(`🚀 RedirectHandler: Moving from ${location.pathname} to ${pendingRedirect}`);
      
      navigate(pendingRedirect, { replace: true });
      
      // Quan trọng: Xóa trạng thái redirect ngay lập tức
      clearPendingRedirect();
    }
  }, [pendingRedirect, navigate, clearPendingRedirect, location.pathname]);

  return null;
};

export default RedirectHandler;