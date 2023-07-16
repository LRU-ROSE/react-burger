import { cx } from "../../utils";
import { getErrorMessage, isUserRequiredError } from '../../helpers/UserRequiredError';
import GotoLogin from '../GotoLogin';
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";

type Props = {
  className?: string;
  error: FetchBaseQueryError | SerializedError | undefined;
  message?: string;
};

const ErrorMessage = ({ className, error, message = 'Ошибка'}: Props) => {
  if (isUserRequiredError(error)) {
    return <GotoLogin />;
  }
  const errMsg = getErrorMessage(error);
  return (
    <p className={cx("text text_type_main-medium mt-8", className)}>
      {errMsg ? `${message}: ${errMsg}`: `${message}...`}
    </p>
  );
};

export default ErrorMessage;
