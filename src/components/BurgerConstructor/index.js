import { useCallback } from 'react';
import { CurrencyIcon, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useBurgerModifier } from '../../providers/BurgerProvider';
import { combineClasses } from '../../utils';
import BurgerComponent from '../BurgerComponent';
import cs from './styles.module.css';
import { useModal } from '../../providers/ModalProvider';
import OrderDetails from '../OrderDetails';

const BurgerConstructor = () => {
  const showModal = useModal();
  const showInfo = useCallback(() => {
    showModal(null, <OrderDetails />);
  }, [showModal]);
  const { totalPrice, bun, components, removeIngredient } = useBurgerModifier();

  const componentsEls = components.map((componentId, idx) => <BurgerComponent id={componentId} key={componentId + idx} onDelete={() => removeIngredient(idx)} />);
  return (
    <div className={combineClasses('pt-25 pl-4', cs.constructor)}>
      <div className={cs.burger}>
        <BurgerComponent id={bun} type='top' />
        <div className={cs.components}>
          {componentsEls}
        </div>
        <BurgerComponent id={bun} type='bottom' />
      </div>
      <div className={combineClasses('mt-10 mr-4', cs.footer)}>
        <div className={combineClasses('mr-10', cs.totalPrice)}>
          <p className='text text_type_digits-medium mr-2'>{totalPrice}</p>
          <CurrencyIcon type='primary'  />
        </div>
        <Button htmlType='button' type='primary' size='large' onClick={showInfo}>Оформить заказ</Button>
      </div>
    </div>
  );
};

export default BurgerConstructor;
