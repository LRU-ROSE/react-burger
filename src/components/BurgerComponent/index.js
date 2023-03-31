import { useMemo } from 'react';
import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useIngredientById } from '../../providers/BurgerProvider';
import { combineClasses } from '../../utils';

import cs from './styles.module.css';

const BurgerComponent = ({ id, type, onDelete }) => {
  const ingredient = useIngredientById(id);

  const extraText = useMemo(() => {
    if (type === 'top') {
      return ' (верх)';
    }
    if (type === 'bottom') {
      return ' (низ)';
    }
    return '';
  }, [type]);

  const isLocked = type === 'top' || type === 'bottom';

  if (!ingredient) {
    return <></>;
  }

  return (
    <div className={combineClasses('pr-4', cs.component)}>
      <div className={combineClasses('mr-2', cs.dragIcon, isLocked ? cs.hidden : '')}>
        <DragIcon type='primary' />
      </div>
      <ConstructorElement type={type} isLocked={isLocked} text={`${ingredient.name}${extraText}`} price={ingredient.price} thumbnail={ingredient.image} handleClose={onDelete}/>
    </div>
  );
};

BurgerComponent.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BurgerComponent;
