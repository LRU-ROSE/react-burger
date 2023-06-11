import { createContext, useCallback, useContext, useState, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Modal from '../components/Modal';
import ModalOverlay from '../components/ModalOverlay';
import useLatest from '../helpers/useLatest';

import cs from './ModalProvider.module.css';

const ModalContext = createContext({
  showModal: () => undefined,
});

export const useModal = () => {
  return useContext(ModalContext).showModal;
};

const ModalProvider = ({ controlsRef, children }) => {
  const [modalInfo, setModalInfo] = useState(null);
  const contentRef = useRef();

  const lastModalInfo = useLatest(modalInfo);
  const lastScrollY = useLatest(window.scrollY);

  const showModal = useCallback((title, el, onClose) => {
    lastModalInfo.current?.onClose?.();
    setModalInfo({el, title, onClose });
  }, [lastModalInfo]);

  const closeModal = useCallback((forceClose = false) => {
    lastModalInfo.current?.onClose?.(forceClose);
    setModalInfo(null);
  }, [lastModalInfo]);

  const context = useMemo(() => ({showModal}), [showModal]);

  useEffect(() => {
    controlsRef.current = {
      forceClose: () => closeModal(true)
    };
  }, [controlsRef, closeModal]);

  const isModalActive = !!modalInfo;
  useEffect(() => {
    const contentEl = contentRef.current;
    if (isModalActive) {
      contentEl.style.position = 'fixed';
      contentEl.style.top = `-${lastScrollY.current.toFixed(2)}px`;
    } else {
      const scrollY = contentEl.style.top;
      contentEl.style.position = '';
      contentEl.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }, [lastScrollY, isModalActive])

  return (
    <ModalContext.Provider value={context}>
      <div className={cs.content} ref={contentRef}>
        {children}
      </div>
      <ModalOverlay onClose={closeModal} visible={Boolean(modalInfo)}/>
      <Modal onClose={closeModal} title={modalInfo?.title ?? ''} visible={Boolean(modalInfo)}>
        {modalInfo?.el}
      </Modal>
    </ModalContext.Provider>
  );
};

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
  controlsRef: PropTypes.any.isRequired
};

export default ModalProvider;
