import { combineClasses } from '../../utils';

import cs from './styles.module.css';

import ok from './ok.svg';

const OrderDetails = () => {
  return (
    <div className={cs.details}>
      <p className={combineClasses('text text_type_digits-large', cs.center)}>034536</p>
      <p className={combineClasses('text text_type_main-medium mt-8', cs.center)}>идентификатор заказа</p>
      <img className={cs.image} src={ok} alt='ОК'/>
      <p className={combineClasses('text text_type_main-default', cs.center)}>Ваш заказ начали готовить</p>
      <p className={combineClasses('text text_type_main-default text_color_inactive mt-2', cs.center)}>Дождитесь готовности на орбитальной станции</p>
    </div>
  );
};

export default OrderDetails;
