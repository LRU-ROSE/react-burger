import { cx } from "../../utils";

type Props = {
  className?: string,
};

const LoadingMessage = ({ className }: Props) => {
  return (
    <p className={cx("text text_type_main-medium mt-8", className)}>
      Загрузка...
    </p>
  );
};

export default LoadingMessage;
