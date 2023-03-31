import { useCallback } from 'react';
import { CurrencyIcon, Counter } from '@ya.praktikum/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useBurgerCounter } from '../../providers/BurgerProvider';
import { combineClasses } from '../../utils';

import cs from './styles.module.css';
import { useModal } from '../../providers/ModalProvider';
import IngredientDetails from '../IngredientDetails';

const Ingredient = ({ id, price, name, image }) => {
  const count = useBurgerCounter(id);
  const showModal = useModal();
  const showInfo = useCallback(() => {
    showModal('Детали ингредиента', <IngredientDetails id={id} />);
  }, [id, showModal]);
  return (
    <article className={cs.ingredient} onClick={showInfo}>
      <img src={image} alt={name} className='ml-4 mr-4'/>
      <div className={`mb-1 mt-1 ${cs.price}`}>
        <p className='text text_type_digits-default mr-2'>{price}</p>
        <CurrencyIcon type='primary'  />
      </div>
      <h3 className={combineClasses('text text_type_main-small', cs.name)}>{name}</h3>
      { count === 0 ? null : <Counter count={count} size='default' extraClass='m-1' /> }
    </article>
  );
};

Ingredient.propTypes = {
  id: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default Ingredient;
