import { useMemo, useRef, useState } from "react";
import {
  ConstructorElement,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrop, useDrag } from "react-dnd";
import { useDispatch } from "react-redux";
import { Ingredient, IngredientType } from "../../types/Ingredient";
import { cx } from "../../utils";

import cs from "./styles.module.css";
import { setBun } from "../../services/burger";
import { DragItem } from "../../types/dragItem";

type Props = {
  component: Ingredient;
  isTemp?: boolean;
  idx?: number;
  className?: string;
  type?: "top" | "bottom" | undefined;
  onDelete?: () => void;
};

const BurgerComponent = ({
  component,
  isTemp = false,
  idx = 0,
  className,
  type = undefined,
  onDelete,
}: Props) => {
  const elRef = useRef(null);
  const [canDrag, setCanDrag] = useState(false);
  const extraText = useMemo(() => {
    switch (type) {
      case "top":
        return " (верх)";
      case "bottom":
        return " (низ)";
      case undefined:
        return "";
    }
  }, [type]);

  const dispatch = useDispatch();

  const [, dropTarget] = useDrop<DragItem>({
    accept: component.type === IngredientType.Bun ? "bun" : "",
    drop(item) {
      dispatch(setBun(item.data));
    },
  });
  const [, dragRef] = useDrag<DragItem>({
    type: "ingredient",
    item: { isNew: false, index: idx, data: component },
  });

  const isLocked = type !== undefined;

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
      className={cx(
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
        className={cx("mr-2", cs.dragIcon, isLocked ? cs.hidden : "")}
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

export default BurgerComponent;
