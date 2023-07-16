import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";

import cs from "./styles.module.css";
import { cx } from "../../utils";

type Props = {
  className?: string;
  isMedium?: boolean;
  value: string | number;
};

const PriceTag = ({ className, isMedium = false, value }: Props) => {
  return (
    <div className={cx(className, cs.tag)}>
      <p
        className={cx(
          "text mr-2",
          isMedium && "text_type_digits-medium",
          !isMedium && "text_type_digits-default"
        )}
      >
        {value}
      </p>
      <CurrencyIcon type="primary" />
    </div>
  );
};

export default PriceTag;
