import PropTypes from 'prop-types';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';

import cs from './styles.module.css';

const Modal = ({title, onClose, children}) => {
  return (
    <div className={cs.modal}>
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
  title: PropTypes.string,
};

export default Modal;
