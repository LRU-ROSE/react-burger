import cs from "./styles.module.css";
import { cx } from "../../utils";

type Props = {
  src: string;
  name: string;
  className?: string;
  moreData?: number;
};

const IngredientIcon = ({ src, name, className, moreData }: Props) => {
  return (
    <div
      className={cx("text text_type_digits-default", cs.icon, className)}
      data-more={moreData}
    >
      <img className={cs.image} src={src} alt={name} />
    </div>
  );
};

export default IngredientIcon;
