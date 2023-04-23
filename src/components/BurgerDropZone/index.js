import { Fragment, useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useDrop } from "react-dnd";

import cs from "./styles.module.css";
import {
  addIngredient,
  moveIngredient,
  removeComponent,
  useComponents,
} from "../../services/burger";
import BurgerComponent from "../BurgerComponent";
import { combineClasses } from "../../utils";

function BurgerDropZone() {
  const components = useComponents();
  const dispatch = useDispatch();

  const [tempEl, setTempEl] = useState(null);
  const tempElStartIdx = useRef(null);
  tempElStartIdx.current = tempEl?.startIdx ?? null;

  console.log('RERENDER');

  let added = false;
  const componentsEls = components.map((data, index) => {
    let el = (
      <BurgerComponent
        className={cs.component}
        component={data}
        idx={index}
        key={data._id + index}
        onDelete={() => dispatch(removeComponent(index))}
      />
    );
    if (!tempEl) {
      return el;
    }
    // Убираем изначальный элемент если он перенесён в другое место
    if (index === tempEl.oldIndex) {
      el = null;
    }
    if (index === tempEl.startIdx) {
      added = true;
      return (
        <Fragment key={`item_with_temp_${data._id}_${index}`}>
          <BurgerComponent component={tempEl.data} idx={index} isTemp />
          {el}
        </Fragment>
      );
    }
    return el;
  });
  if (tempEl && !added) {
    componentsEls.push(
      <BurgerComponent
        component={tempEl.data}
        idx={0}
        key={`temp_${tempEl.data._id}`}
        isTemp
      />
    );
  }

  const handleHover = useCallback((item, monitor) => {
    if (components.length === 0) {
      if (tempElStartIdx.current !== 0) {
        setTempEl({ data: item.data, startIdx: 0 });
      }
      return;
    }
    const clientOffset = monitor.getClientOffset();
    const el = document
      .elementsFromPoint(clientOffset.x, clientOffset.y)
      .find((el) => el.classList?.contains(cs.component));
    if (!el) {
      return;
    }
    const elRect = el.getBoundingClientRect();
    const elMiddleY = (elRect.bottom - elRect.top) / 2;
    // Мышка находится выше середины компонента на который хотим дропнуть или нет
    const hoverTop = clientOffset.y - elRect.top < elMiddleY;
    const idx = +el.getAttribute("data-idx");
    const startIdx = hoverTop ? idx : idx + 1;
    if (item.type === "new-ingredient") {
      if (tempElStartIdx.current !== startIdx) {
        setTempEl({ data: item.data, startIdx });
      }
    } else {
      if (
        item.index === idx ||
        item.index === (hoverTop ? idx - 1 : idx + 1)
      ) {
        if (tempElStartIdx.current !== null) {
          setTempEl(null);
        }
      } else if (tempElStartIdx.current !== startIdx) {
        setTempEl({
          data: item.data,
          startIdx,
          oldIndex: item.index,
        });
      }
    }
  }, [components.length]);

  const [isOver, dropTarget] = useDrop({
    accept: "ingredient",
    drop() {
      if (tempEl) {
        if (Object.hasOwn(tempEl, 'oldIndex')) {
          dispatch(
            moveIngredient({
              oldIndex: tempEl.oldIndex,
              newIndex: tempEl.startIdx,
            })
          );
        } else {
          dispatch(addIngredient(tempEl));
        }
        setTempEl(null);
      }
    },
    hover: handleHover,
    collect(monitor) {
      return monitor.isOver();
    },
  });

  useEffect(() => {
    if (!isOver && tempElStartIdx.current !== null) {
      setTempEl(null);
    }
  }, [isOver, dispatch]);

  return (
    <div
      className={combineClasses(
        cs.zone,
        componentsEls.length === 0 && cs.emptyZone
      )}
      ref={dropTarget}
    >
      {componentsEls.length === 0 ? (
        <p className={"text text_type_main-default " + cs.emptyText}>
          Перенесите ингредиенты
        </p>
      ) : (
        componentsEls
      )}
    </div>
  );
}

export default BurgerDropZone;
