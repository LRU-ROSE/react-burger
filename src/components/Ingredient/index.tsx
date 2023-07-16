import {
  CurrencyIcon,
  Counter,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrag } from "react-dnd";
import { Ingredient, IngredientType } from "../../types/Ingredient";
import { cx } from "../../utils";

import cs from "./styles.module.css";
import IngredientDetails from "../IngredientDetails";
import { useUsedComponentCount } from "../../services/burger";
import usePathModal from "../../helpers/usePathModal";
import { DragItem } from "../../types/dragItem";

type Props = {
  data: Ingredient;
};

const IngredientEl = ({ data }: Props) => {
  const { _id: id, price, name, image, type } = data;
  const count = useUsedComponentCount(id);
  const showInfo = usePathModal(
    "Детали ингредиента",
    () => <IngredientDetails data={data} />,
    () => `/ingredients/${data._id}`
  );
  const [{ isDrag }, dragRef] = useDrag<DragItem, unknown, { isDrag: boolean }>(
    {
      type: type === IngredientType.Bun ? "bun" : "ingredient",
      item: { isNew: true, data },
      collect: (monitor) => ({
        isDrag: monitor.isDragging(),
      }),
    }
  );
  return (
    <article
      className={cx(cs.ingredient, isDrag && cs.dragged)}
      onClick={showInfo}
      ref={dragRef}
    >
      <img src={image} alt={name} className="ml-4 mr-4" />
      <div className={`mb-1 mt-1 ${cs.price}`}>
        <p className="text text_type_digits-default mr-2">{price}</p>
        <CurrencyIcon type="primary" />
      </div>
      <h3 className={cx("text text_type_main-small", cs.name)}>{name}</h3>
      {count === 0 ? null : (
        <Counter count={count} size="default" extraClass="m-1" />
      )}
    </article>
  );
};

export default IngredientEl;
