import { cx } from '../../utils';

import cs from './styles.module.css';

type Props = {
  onClose: () => void;
  visible: boolean;
}

const ModalOverlay = ({ onClose, visible }: Props) => {
  return (
    <div className={cx(cs.overlay, visible ? '' : cs.hidden)} onClick={onClose}/>
  );
};

export default ModalOverlay;
