import { combineClasses } from '../../utils';
import Ingredient from '../Ingredient';
import PropTypes from 'prop-types';
import IngredientType from '../../types/Ingredient';

import cs from './styles.module.css';

const IngredientsSection = ({ name, className, index, ingredients }) => {
  const ingredientsEls = ingredients.map((item) => <Ingredient data={item} key={item._id} />);
  return (
    <div className={combineClasses(cs.section, className)} data-index={index}>
      <h2 className={`text text_type_main-medium mb-6 ${cs.header}`}>{name}</h2>
      {ingredientsEls}
    </div>
  );
};

IngredientsSection.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  ingredients: PropTypes.arrayOf(IngredientType.isRequired).isRequired,
};

export default IngredientsSection;
