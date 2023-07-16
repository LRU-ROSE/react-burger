import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import ModalProvider, { ModalControls } from "../../providers/ModalProvider";
import { store } from "../../services";
import AppHeader from "../AppHeader";
import ConstructorPage from "../../pages/ConstructorPage";
import IngredientsPage from "../../pages/IngredientPage";
import ProtectedRouteElement from "../ProtectedRouteElement";
import LoginPage from "../../pages/Login";
import RegisterPage from "../../pages/RegisterPage";
import ForgotPasswordPage from "../../pages/ForgotPasswordPage";
import ResetPasswordPage from "../../pages/ResetPasswordPage";
import ProfilePage from "../../pages/ProfilePage";
import NotFoundPage from "../../pages/NotFoundPage";
import OrdersFeedPage from "../../pages/OrdersFeedPage";
import OrdersHistoryPage from "../../pages/OrdersHistoryPage";
import FeedDetailsPage from "../../pages/FeedDetailsPage";
import HistoryDetailsPage from "../../pages/HistoryDetailsPage";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const realLocation = location.state?.backgroundLocation ?? location;
  const prevPath = useRef();
  const modalControls = useRef<ModalControls>();

  // Github pages hack
  useEffect(() => {
    const path = localStorage.getItem("gh-pages-path");
    if (path) {
      localStorage.removeItem("gh-pages-path");
      navigate(path, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (prevPath.current !== realLocation.pathname) {
      modalControls.current?.forceClose();
      prevPath.current = realLocation.pathname;
    }
  }, [realLocation.pathname]);
  return (
    <>
      <Provider store={store}>
        <ModalProvider controlsRef={modalControls}>
          <AppHeader />
          <DndProvider backend={HTML5Backend}>
            <Routes location={realLocation}>
              <Route path="/" element={<ConstructorPage />} />
              <Route path="/feed" element={<OrdersFeedPage />} />
              <Route path="/feed/:id" element={<FeedDetailsPage />} />
              <Route path="/ingredients/:id" element={<IngredientsPage />} />
              <Route
                path="/login"
                element={
                  <ProtectedRouteElement needAuth={false}>
                    <LoginPage />
                  </ProtectedRouteElement>
                }
              />
              <Route
                path="/register"
                element={
                  <ProtectedRouteElement needAuth={false}>
                    <RegisterPage />
                  </ProtectedRouteElement>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <ProtectedRouteElement needAuth={false}>
                    <ForgotPasswordPage />
                  </ProtectedRouteElement>
                }
              />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRouteElement needAuth={true}>
                    <ProfilePage />
                  </ProtectedRouteElement>
                }
              />
              <Route
                path="/profile/orders"
                element={
                  <ProtectedRouteElement needAuth={true}>
                    <OrdersHistoryPage />
                  </ProtectedRouteElement>
                }
              />
              <Route path="/profile/orders/:id" element={<HistoryDetailsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </DndProvider>
        </ModalProvider>
      </Provider>
    </>
  );
};

export default App;
