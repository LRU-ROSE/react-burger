import { Navigate, useLocation } from "react-router-dom";

const GotoLogin = () => {
  const location = useLocation();
  return <Navigate to={`/login?return=${encodeURIComponent(location.pathname)}`} replace />;
};

export default GotoLogin;
