import { cx } from '../../utils';
import { Ingredient } from '../../types/Ingredient';

import cs from './styles.module.css';

type Props = {
  data: Ingredient;
}

const IngredientDetails = ({data}: Props) => {
  const { name, image_large, calories, proteins, fat, carbohydrates } = data;
  return (
    <div className={cs.details}>
      <img src={image_large} alt={name} className={cs.image}/>
      <h3 className={cx('text text_type_main-medium mt-4', cs.name)}>{name}</h3>
      <div className={cx('mt-8', cs.table)}>
        <div className={cs.column}>
          <p className={cx('text text_type_main-default text_color_inactive', cs.row)}>Калории,ккал</p>
          <p className={cx('text text_type_digits-default text_color_inactive', cs.row)}>{calories}</p>
        </div>
        <div className={cs.column}>
          <p className={cx('text text_type_main-default text_color_inactive', cs.row)}>Белки, г</p>
          <p className={cx('text text_type_digits-default text_color_inactive', cs.row)}>{proteins}</p>
        </div>
        <div className={cs.column}>
          <p className={cx('text text_type_main-default text_color_inactive', cs.row)}>Жиры, г</p>
          <p className={cx('text text_type_digits-default text_color_inactive', cs.row)}>{fat}</p>
        </div>
        <div className={cs.column}>
          <p className={cx('text text_type_main-default text_color_inactive', cs.row)}>Углеводы, г</p>
          <p className={cx('text text_type_digits-default text_color_inactive', cs.row)}>{carbohydrates}</p>
        </div>
      </div>
    </div>
  );
};

export default IngredientDetails;
