import { useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useLatest from "./useLatest";
import { useModal } from "../providers/ModalProvider";

const usePathModal = (title, createModal, makePath) => {
  const unloadFunc = useRef(null);
  const modalData = useLatest({
    title,
    createModal,
    makePath,
    showModal: useModal(),
    navigate: useNavigate(),
    location: useLocation(),
  });
  return useCallback(
    (...args) => {
      const {
        navigate,
        location,
        showModal,
        title: mTitle,
        createModal: mCreateModal,
        makePath: mMakePath,
      } = modalData.current;
      if (!unloadFunc.current) {
        unloadFunc.current = () => {
          window.history.replaceState({}, "");
        };
        window.addEventListener("beforeunload", unloadFunc.current);
      }
      showModal(mTitle, mCreateModal(...args), () => {
        navigate(-1);
        window.history.replaceState({}, "");
        if (unloadFunc.current) {
          window.removeEventListener("beforeunload", unloadFunc.current);
          unloadFunc.current = null;
        }
      });
      navigate(mMakePath(...args), {
        state: { backgroundLocation: location },
      });
    },
    [modalData]
  );
};

export default usePathModal;
