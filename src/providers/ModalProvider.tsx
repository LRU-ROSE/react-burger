import {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  useEffect,
  useRef,
  MutableRefObject,
  ReactNode,
} from "react";
import Modal from "../components/Modal";
import ModalOverlay from "../components/ModalOverlay";
import useLatest from "../helpers/useLatest";

import cs from "./ModalProvider.module.css";

type ShowModalFunc = (
  title: string | null,
  el: JSX.Element,
  onClose?: (isForce: boolean) => void
) => void;

type ContextType = {
  showModal: ShowModalFunc;
};

const ModalContext = createContext<ContextType>(null as any);

export const useModal = () => {
  return useContext(ModalContext).showModal;
};

type ModalInfo = {
  title: string | null;
  el: JSX.Element;
  onClose: ((isForce: boolean) => void) | undefined;
};

export type ModalControls = {
  forceClose: () => void;
};

type Props = {
  controlsRef: MutableRefObject<ModalControls | undefined>;
  children: ReactNode;
};

const ModalProvider = ({ controlsRef, children }: Props) => {
  const [modalInfo, setModalInfo] = useState<ModalInfo>();
  const contentRef = useRef<HTMLDivElement>(null);

  const lastModalInfo = useLatest(modalInfo);
  const lastScrollY = useLatest(window.scrollY);

  const showModal: ShowModalFunc = useCallback(
    (title, el, onClose) => {
      lastModalInfo.current?.onClose?.(false);
      setModalInfo({ el, title, onClose });
    },
    [lastModalInfo]
  );

  const closeModal = useCallback(
    (forceClose = false) => {
      lastModalInfo.current?.onClose?.(forceClose);
      setModalInfo(undefined);
    },
    [lastModalInfo]
  );

  const context = useMemo(() => ({ showModal }), [showModal]);

  useEffect(() => {
    controlsRef.current = {
      forceClose: () => closeModal(true),
    };
  }, [controlsRef, closeModal]);

  const isModalActive = !!modalInfo;
  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) {
      return;
    }
    if (isModalActive) {
      contentEl.style.position = "fixed";
      contentEl.style.top = `-${lastScrollY.current.toFixed(2)}px`;
    } else {
      const scrollY = contentEl.style.top;
      contentEl.style.position = "";
      contentEl.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }, [lastScrollY, isModalActive]);

  return (
    <ModalContext.Provider value={context}>
      <div className={cs.content} ref={contentRef}>
        {children}
      </div>
      <ModalOverlay onClose={closeModal} visible={Boolean(modalInfo)} />
      <Modal
        onClose={closeModal}
        title={modalInfo?.title ?? ""}
        visible={Boolean(modalInfo)}
      >
        {modalInfo?.el}
      </Modal>
    </ModalContext.Provider>
  );
};

export default ModalProvider;
