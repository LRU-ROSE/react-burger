import { createContext, useCallback, useContext, useState, useMemo } from 'react';
import Modal from '../components/Modal';
import ModalOverlay from '../components/ModalOverlay';

const ModalContext = createContext({
  showModal: () => undefined,
});

export const useModal = () => {
  return useContext(ModalContext).showModal;
};

const ModalProvider = ({children}) => {
  const [modalInfo, setModalInfo] = useState(null);
  const showModal = useCallback((title, el) => {
    setModalInfo({el, title});
  }, []);
  const closeModal = useCallback(() => {
    setModalInfo(null);
  }, []);

  const context = useMemo(() => ({ showModal}), [showModal]);

  return (
    <ModalContext.Provider value={context}>
      {children}
      <ModalOverlay onClose={closeModal} visible={Boolean(modalInfo)}>
        <Modal onClose={closeModal} title={modalInfo?.title}>
          {modalInfo?.el}
        </Modal>
      </ModalOverlay>
    </ModalContext.Provider>
  );
};

export default ModalProvider;
