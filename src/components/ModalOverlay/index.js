import { useCallback, useRef, useEffect } from 'react';
import { combineClasses } from '../../utils';
import PropTypes from 'prop-types';

import cs from './styles.module.css';

const ModalOverlay = ({ onClose, visible, children }) => {
  const overlay = useRef();
  const handleClick = useCallback((e) => {
    // Закрываем только если кликнули по самому оверлею
    if (e.target === overlay.current) {
      onClose();
    }
  }, [onClose]);

  const handleEsc = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (visible) {
      overlay.current.focus();
    }
  }, [visible]);

  return <div className={combineClasses(cs.overlay, visible ? '' : cs.hidden)} onClick={handleClick} onKeyDown={handleEsc} tabIndex='0' ref={overlay}>
    {children}
  </div>;
};

ModalOverlay.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default ModalOverlay;
