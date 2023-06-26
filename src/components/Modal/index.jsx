import { useCallback, useRef, useEffect } from 'react';

import PropTypes from 'prop-types';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';

import cs from './styles.module.css';
import { cx } from '../../utils';

const Modal = ({title, onClose, visible, children}) => {
  const modal = useRef();
  const handleEsc = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (visible) {
      modal.current.focus();
    }
  }, [visible]);

  return (
    <div className={cx(cs.modal, visible ? '' : cs.hidden)} onKeyDown={handleEsc} ref={modal} tabIndex='0'>
      <div className={cs.header}>
        <h2 className='text text_type_main-large'>{title}</h2>
        <button type='button' className={cs.close} onClick={onClose}>
          <CloseIcon type='primary' />
        </button>
      </div>
      {children}
    </div>
  );
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default Modal;
