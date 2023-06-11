import { cx } from '../../utils';

import cs from './styles.module.css';

import ok from './ok.svg';
import { useEffect, useRef } from 'react';
import { useAllComponents } from '../../services/burger';
import { useSendOrderMutation } from '../../services/api/userApi';
import { isUserRequiredError } from '../../helpers/UserRequiredError';
import GotoLogin from '../GotoLogin';

const OrderCompleted = () => {
  const components = useAllComponents();
  const componentsRef = useRef(components);

  const [sendOrder, { error, data }] = useSendOrderMutation();
  useEffect(() => {
    if (componentsRef.current !== null) {
      sendOrder(componentsRef.current);
      componentsRef.current = null;
    }
  }, [sendOrder]);

  if (!data) {
    if (isUserRequiredError(error)) {
      return <GotoLogin />;
    }
    const text = error ? `Ошибка: ${error.error ?? error}` : 'Отправка...';
    return <div className={cs.details}>
      <p className={cx('text text_type_main-medium mt-8', cs.center, error && cs.error)}>{text}</p>
    </div>;
  }

  return (
    <div className={cs.details}>
      <p className={cx('text text_type_digits-large', cs.center)}>{data.order.number}</p>
      <p className={cx('text text_type_main-medium mt-8', cs.center)}>идентификатор заказа</p>
      <img className={cs.image} src={ok} alt='ОК'/>
      <p className={cx('text text_type_main-default', cs.center)}>Ваш заказ начали готовить</p>
      <p className={cx('text text_type_main-default text_color_inactive mt-2', cs.center)}>Дождитесь готовности на орбитальной станции</p>
    </div>
  );
};

export default OrderCompleted;
