import PropTypes from 'prop-types';

import { cx } from "../../utils";

const LoadingMessage = ({ className }) => {
  return (
    <p className={cx("text text_type_main-medium mt-8", className)}>
      Загрузка...
    </p>
  );
};

LoadingMessage.propTypes = {
  className: PropTypes.string,
};

export default LoadingMessage;
