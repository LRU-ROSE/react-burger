import { useCallback } from "react";
import {
  CurrencyIcon,
  Counter,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrag } from "react-dnd";
import IngredientType from "../../types/Ingredient";
import { combineClasses } from "../../utils";

import cs from "./styles.module.css";
import { useModal } from "../../providers/ModalProvider";
import IngredientDetails from "../IngredientDetails";
import { bunType } from "../../helpers/ingredientTypes";
import { useUsedComponentCount } from "../../services/burger";

const Ingredient = ({ data }) => {
  const { _id: id, price, name, image, type } = data;
  const count = useUsedComponentCount(id);
  const showModal = useModal();
  const showInfo = useCallback(() => {
    showModal("Детали ингредиента", <IngredientDetails data={data} />);
  }, [data, showModal]);
  const [{ isDrag }, dragRef] = useDrag({
    type: type === bunType ? "bun" : "ingredient",
    item: { type: "new-ingredient", data },
    collect: (monitor) => ({
      isDrag: monitor.isDragging(),
    }),
  });
  return (
    <article
      className={combineClasses(cs.ingredient, isDrag && cs.dragged)}
      onClick={showInfo}
      ref={dragRef}
    >
      <img src={image} alt={name} className="ml-4 mr-4" />
      <div className={`mb-1 mt-1 ${cs.price}`}>
        <p className="text text_type_digits-default mr-2">{price}</p>
        <CurrencyIcon type="primary" />
      </div>
      <h3 className={combineClasses("text text_type_main-small", cs.name)}>
        {name}
      </h3>
      {count === 0 ? null : (
        <Counter count={count} size="default" extraClass="m-1" />
      )}
    </article>
  );
};

Ingredient.propTypes = {
  data: IngredientType.isRequired,
};

export default Ingredient;
