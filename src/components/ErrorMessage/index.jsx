import PropTypes from 'prop-types';

import { cx } from "../../utils";
import { isUserRequiredError } from '../../helpers/UserRequiredError';
import GotoLogin from '../GotoLogin';

const ErrorMessage = ({ className, error, message = 'Ошибка'}) => {
  if (isUserRequiredError(error)) {
    return <GotoLogin />;
  }
  const err = error?.error ?? error;
  const errMsg = err?.message ?? err;
  return (
    <p className={cx("text text_type_main-medium mt-8", className)}>
      {errMsg ? `${message}: ${errMsg}`: `${message}...`}
    </p>
  );
};

ErrorMessage.propTypes = {
  className: PropTypes.string,
  error: PropTypes.object,
  message: PropTypes.string,
};

export default ErrorMessage;
