import { useCallback, useRef, useEffect, ReactNode, KeyboardEvent } from "react";

import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";

import cs from "./styles.module.css";
import { cx } from "../../utils";

type Props = {
  onClose: () => void;
  title: string;
  visible: boolean;
  children: ReactNode;
};

const Modal = ({ title, onClose, visible, children }: Props) => {
  const modal = useRef<HTMLDivElement>(null);
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (visible) {
      modal.current?.focus();
    }
  }, [visible]);

  return (
    <div
      className={cx(cs.modal, visible ? "" : cs.hidden)}
      onKeyDown={handleEsc}
      ref={modal}
      tabIndex={0}
    >
      <div className={cs.header}>
        <h2 className="text text_type_main-large">{title}</h2>
        <button type="button" className={cs.close} onClick={onClose}>
          <CloseIcon type="primary" />
        </button>
      </div>
      {children}
    </div>
  );
};

export default Modal;
