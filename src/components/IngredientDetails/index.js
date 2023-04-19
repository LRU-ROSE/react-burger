import PropTypes from 'prop-types';
import { useIngredientById } from '../../providers/BurgerProvider';
import { combineClasses } from '../../utils';

import cs from './styles.module.css';

const IngredientDetails = ({id}) => {
  const { name, image_large, calories, proteins, fat, carbohydrates } = useIngredientById(id);
  return (
    <div className={cs.details}>
      <img src={image_large} alt={name} className={cs.image}/>
      <h3 className={combineClasses('text text_type_main-medium mt-4', cs.name)}>{name}</h3>
      <div className={combineClasses('mt-8', cs.table)}>
        <div className={cs.column}>
          <p className={combineClasses('text text_type_main-default text_color_inactive', cs.row)}>Калории,ккал</p>
          <p className={combineClasses('text text_type_digits-default text_color_inactive', cs.row)}>{calories}</p>
        </div>
        <div className={cs.column}>
          <p className={combineClasses('text text_type_main-default text_color_inactive', cs.row)}>Белки, г</p>
          <p className={combineClasses('text text_type_digits-default text_color_inactive', cs.row)}>{proteins}</p>
        </div>
        <div className={cs.column}>
          <p className={combineClasses('text text_type_main-default text_color_inactive', cs.row)}>Жиры, г</p>
          <p className={combineClasses('text text_type_digits-default text_color_inactive', cs.row)}>{fat}</p>
        </div>
        <div className={cs.column}>
          <p className={combineClasses('text text_type_main-default text_color_inactive', cs.row)}>Углеводы, г</p>
          <p className={combineClasses('text text_type_digits-default text_color_inactive', cs.row)}>{carbohydrates}</p>
        </div>
      </div>
    </div>
  );
};

IngredientDetails.propTypes = {
  id: PropTypes.string.isRequired,
};

export default IngredientDetails;
