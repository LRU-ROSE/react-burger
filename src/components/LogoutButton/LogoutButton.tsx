import { ReactNode, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useLogoutMutation } from "../../services/api/authApi";

type Props = {
  className?: string;
  children: ReactNode;
};

const LogoutButton = ({ className, children }: Props) => {
  const [logout, status] = useLogoutMutation();
  const handleExit = useCallback(() => {
    logout();
  }, [logout]);

  if (status.isSuccess) {
    return <Navigate to="/" replace />;
  }

  if (status.isLoading) {
    return <p className={className}>Выход...</p>;
  }

  return (
    <button onClick={handleExit} className={className}>
      {children}
    </button>
  );
};

export default LogoutButton;
