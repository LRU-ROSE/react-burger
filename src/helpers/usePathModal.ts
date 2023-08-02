import { useCallback, useRef } from "react";
import { To, useLocation, useNavigate } from "react-router-dom";
import useLatest from "./useLatest";
import { useModal } from "../providers/ModalProvider";

type Func<T, R> = (arg: T) => R;

const usePathModal = <T>(
  title: string,
  createModal: Func<T, JSX.Element>,
  makePath: Func<T, To>
): Func<T, void> => {
  const unloadFunc = useRef<() => void>();
  const modalData = useLatest({
    title,
    createModal,
    makePath,
    showModal: useModal(),
    navigate: useNavigate(),
    location: useLocation(),
  });
  return useCallback(
    (arg) => {
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
      showModal(mTitle, mCreateModal(arg), () => {
        navigate(-1);
        window.history.replaceState({}, "");
        if (unloadFunc.current) {
          window.removeEventListener("beforeunload", unloadFunc.current);
          unloadFunc.current = undefined;
        }
      });
      navigate(mMakePath(arg), {
        state: { backgroundLocation: location },
      });
    },
    [modalData]
  );
};

export default usePathModal;
