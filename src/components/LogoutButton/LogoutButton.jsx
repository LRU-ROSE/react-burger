import { useCallback } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useLogoutMutation } from "../../services/api/authApi";

const LogoutButton = ({ className, children }) => {
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

LogoutButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default LogoutButton;
