import PropTypes from 'prop-types';

import cs from "./styles.module.css";
import { cx } from "../../utils";

const IngredientIcon = ({ src, name, className, moreData }) => {
  return (
    <div
      className={cx("text text_type_digits-default", cs.icon, className)}
      data-more={moreData}
    >
      <img className={cs.image} src={src} alt={name} />
    </div>
  );
};

IngredientIcon.propTypes = {
  src: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  moreData: PropTypes.number,
};

export default IngredientIcon;
