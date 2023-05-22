import { createContext, useCallback, useContext, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '../components/Modal';
import ModalOverlay from '../components/ModalOverlay';
import useLatest from '../helpers/useLatest';

const ModalContext = createContext({
  showModal: () => undefined,
});

export const useModal = () => {
  return useContext(ModalContext).showModal;
};

const ModalProvider = ({ controlsRef, children }) => {
  const [modalInfo, setModalInfo] = useState(null);

  const lastModalInfo = useLatest(modalInfo);

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

  return (
    <ModalContext.Provider value={context}>
      {children}
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
