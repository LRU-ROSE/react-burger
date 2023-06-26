import { cx } from '../../utils';
import PropTypes from 'prop-types';

import cs from './styles.module.css';

const ModalOverlay = ({ onClose, visible }) => {
  return (
    <div className={cx(cs.overlay, visible ? '' : cs.hidden)} onClick={onClose}/>
  );
};

ModalOverlay.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default ModalOverlay;
