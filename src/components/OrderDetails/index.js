import { combineClasses } from '../../utils';

import cs from './styles.module.css';

import ok from './ok.svg';
import { useEffect, useRef, useState } from 'react';
import { sendOrder } from '../../api/ingredients';
import { useAllComponents } from '../../providers/BurgerProvider';

const OrderDetails = () => {
  const components = useAllComponents();
  const componentsRef = useRef(components);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);
  useEffect(() => {
    if (componentsRef.current === null) {
      return;
    }
    sendOrder(componentsRef.current).then((data) => {
      setId(data.order.number);
      setError(null);
    }, (error) => {
      setId(null);
      setError(error);
    }).finally(() => {
      setIsLoading(false);
    });
    componentsRef.current = null;
  }, []);
  if (isLoading || error !== null) {
    const text = isLoading ? 'Отправка...' : `Ошибка: ${error.toString()}`;
    return <div className={cs.details}>
      <p className={combineClasses('text text_type_main-medium mt-8', cs.center, !isLoading && cs.error)}>{text}</p>
    </div>;
  }
  return (
    <div className={cs.details}>
      <p className={combineClasses('text text_type_digits-large', cs.center)}>{id}</p>
      <p className={combineClasses('text text_type_main-medium mt-8', cs.center)}>идентификатор заказа</p>
      <img className={cs.image} src={ok} alt='ОК'/>
      <p className={combineClasses('text text_type_main-default', cs.center)}>Ваш заказ начали готовить</p>
      <p className={combineClasses('text text_type_main-default text_color_inactive mt-2', cs.center)}>Дождитесь готовности на орбитальной станции</p>
    </div>
  );
};

export default OrderDetails;
