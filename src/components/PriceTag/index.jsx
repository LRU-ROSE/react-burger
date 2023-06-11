import PropTypes from 'prop-types';

import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";

import cs from './styles.module.css';
import { cx } from "../../utils";

const PriceTag = ({ className, isMedium = false, value }) => {
  return (
    <div className={cx(className, cs.tag)}>
      <p className={cx("text mr-2", isMedium && "text_type_digits-medium", !isMedium && "text_type_digits-default")}>{value}</p>
      <CurrencyIcon type="primary" />
    </div>
  );
};

PriceTag.propTypes = {
  isMedium: PropTypes.bool,
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default PriceTag;
