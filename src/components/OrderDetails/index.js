import { combineClasses } from '../../utils';

import cs from './styles.module.css';

import ok from './ok.svg';
import { useEffect, useRef } from 'react';
import { clearComponents, useAllComponents } from '../../services/burger';
import { useSendOrderMutation } from '../../services/api';
import { useDispatch } from 'react-redux';

const OrderDetails = () => {
  const components = useAllComponents();
  const componentsRef = useRef(components);

  const cleared = useRef(false);

  const [sendOrder, { error, data }] = useSendOrderMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (componentsRef.current === null) {
      return;
    }
    sendOrder(componentsRef.current);
    componentsRef.current = null;
  }, [sendOrder]);

  useEffect(() => {
    if (!cleared.current) {
      cleared.current = true;
      dispatch(clearComponents());
    }
  }, [data]);

  if (!data) {
    const text = error ? `Ошибка: ${error.toString()}` : 'Отправка...';
    return <div className={cs.details}>
      <p className={combineClasses('text text_type_main-medium mt-8', cs.center, error && cs.error)}>{text}</p>
    </div>;
  }

  return (
    <div className={cs.details}>
      <p className={combineClasses('text text_type_digits-large', cs.center)}>{data.order.number}</p>
      <p className={combineClasses('text text_type_main-medium mt-8', cs.center)}>идентификатор заказа</p>
      <img className={cs.image} src={ok} alt='ОК'/>
      <p className={combineClasses('text text_type_main-default', cs.center)}>Ваш заказ начали готовить</p>
      <p className={combineClasses('text text_type_main-default text_color_inactive mt-2', cs.center)}>Дождитесь готовности на орбитальной станции</p>
    </div>
  );
};

export default OrderDetails;
