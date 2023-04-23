import { useMemo, useRef, useState } from "react";
import {
  ConstructorElement,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import PropTypes from "prop-types";
import { useDrop, useDrag } from "react-dnd";
import { useDispatch } from "react-redux";
import IngredientType from "../../types/Ingredient";
import { combineClasses } from "../../utils";

import cs from "./styles.module.css";
import { bunType } from "../../helpers/ingredientTypes";
import { setBun } from "../../services/burger";

const BurgerComponent = ({
  component,
  isTemp = false,
  idx = 0,
  className,
  type,
  onDelete,
}) => {
  const elRef = useRef(null);
  const [canDrag, setCanDrag] = useState(false);
  const extraText = useMemo(() => {
    if (type === "top") {
      return " (верх)";
    }
    if (type === "bottom") {
      return " (низ)";
    }
    return "";
  }, [type]);

  const dispatch = useDispatch();

  const [, dropTarget] = useDrop({
    accept: component.type === bunType ? "bun" : "",
    drop(item) {
      dispatch(setBun(item.data));
    },
  });
  const [, dragRef] = useDrag({
    type: "ingredient",
    item: { type: "ingredient", index: idx, data: component },
    collect: (monitor) => ({
      isDrag: monitor.isDragging(),
    }),
  });

  const isLocked = type === "top" || type === "bottom";

  if (isLocked) {
    dropTarget(elRef);
  } else {
    dragRef(canDrag ? elRef : null);
  }

  const [dragEnter, dragLeave] = useMemo(() => {
    return [() => setCanDrag(true), () => setCanDrag(false)];
  }, [setCanDrag]);

  return (
    <div
      className={combineClasses(
        "pr-4",
        cs.component,
        isTemp && cs.tempComponent,
        !isLocked && cs.addGap,
        type === "top" && cs.addBottomGap,
        type === "bottom" && cs.addTopGap,
        className
      )}
      data-idx={idx}
      ref={elRef}
    >
      <div
        className={combineClasses(
          "mr-2",
          cs.dragIcon,
          isLocked ? cs.hidden : ""
        )}
        onMouseEnter={dragEnter}
        onMouseLeave={dragLeave}
      >
        <DragIcon type="primary" />
      </div>
      <ConstructorElement
        type={type}
        isLocked={isLocked}
        text={`${component.name}${extraText}`}
        price={component.price}
        thumbnail={component.image}
        handleClose={onDelete}
      />
    </div>
  );
};

BurgerComponent.propTypes = {
  component: IngredientType.isRequired,
  isTemp: PropTypes.bool, // Необязателен (по-умолчанию компонент не "временный")
  idx: PropTypes.number, // Необязателен (у "булок" индекс можно опустить)
  className: PropTypes.string, // Опциональный CSS-класс добавляемый элементу
  type: PropTypes.string, // Необязателен (undefined или null означает что компонент является начинкой или соусом)
  onDelete: PropTypes.func, // Необязателен ('булки' и временные компоненты не могут быть удалены)
};

export default BurgerComponent;
