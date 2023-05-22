import { useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useHasUser } from "../../services/auth";
import GotoLogin from "../GotoLogin";

const ProtectedRouteElement = ({ children, needAuth = null }) => {
  const location = useLocation();
  const hasUser = useHasUser();
  const lastData = useRef({
    path: location.pathname,
    hasUser
  });
  // Реакт переиспользует элемент для различных страниц,
  // потому обновляем состояние "имеется пользователь"
  // только один раз при смене пути
  if (lastData.current.path !== location.pathname) {
    lastData.current = {
      path: location.pathname,
      hasUser
    };
  }
  if (needAuth === null || needAuth === lastData.current.hasUser) {
    return <>{children}</>;
  }
  if (needAuth) {
    return <GotoLogin />;
  }
  return <Navigate to="/" replace />;
};

ProtectedRouteElement.propTypes = {
  needAuth: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default ProtectedRouteElement;
