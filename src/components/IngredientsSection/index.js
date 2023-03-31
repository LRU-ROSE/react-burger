import { useIngredientsByType } from '../../providers/BurgerProvider';
import { combineClasses } from '../../utils';
import Ingredient from '../Ingredient';
import PropTypes from 'prop-types';

import cs from './styles.module.css';

const IngredientsSection = ({ type, name, className, index }) => {
  const ingredients = useIngredientsByType(type);
  let ingredientsEls;
  if (ingredients) {
    ingredientsEls = ingredients.map((item) => <Ingredient image={item.image} price={item.price} name={item.name} id={item._id} key={item._id} />);
  } else {
    ingredientsEls = '...';
  }
  return (
    <div className={combineClasses(cs.section, className)} data-index={index}>
      <h2 className={`text text_type_main-medium mb-6 ${cs.header}`}>{name}</h2>
      {ingredientsEls}
    </div>
  );
};

IngredientsSection.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default IngredientsSection;
