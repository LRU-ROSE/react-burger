import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";
import { useCallback, useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { cx } from "../../utils";
import IngredientsSection from "../IngredientsSection";

import cs from "./styles.module.css";
import { useGetIngredientsQuery } from "../../services/api/ingredientsApi";
import { setDefaultBun } from "../../services/burger";
import LoadingMessage from "../LoadingMessage";
import ErrorMessage from "../ErrorMessage";
import { IngredientType } from "../../types/Ingredient";

const IngredientNames = Object.entries({
    [IngredientType.Bun]: 'Булки',
    [IngredientType.Sauce]: 'Соусы',
    [IngredientType.Main]: 'Начинки',
}) as [IngredientType, string][];

const BurgerIngredients = () => {
  const scroller = useRef<HTMLDivElement>(null);
  const [tabIdx, setTabIdx] = useState(0);

  const { data, error, isLoading } = useGetIngredientsQuery();
  const firstTime = useRef(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (firstTime.current && data) {
      dispatch(setDefaultBun(data.byType[IngredientType.Bun]?.[0] ?? null));
      firstTime.current = false;
    }
  }, [isLoading, data, dispatch]);

  const scrollIntoSection = useCallback((idx: string) => {
    // scroller - ссылка, а потому useCallback здесь уместен, чтобы не пересоздавать функцию
    const section = scroller.current?.children[+idx];
    if (!section) {
      return;
    }
    section.scrollIntoView({ behavior: "smooth" });
    setTabIdx(+idx);
  }, []);

  const handleScroll = useCallback(() => {
    if (!scroller.current) {
      return;
    }
    // scroller - ссылка, а потому useCallback здесь уместен, чтобы не пересоздавать функцию
    const el = document
      .elementsFromPoint(
        scroller.current.offsetLeft + 10,
        scroller.current.offsetTop + 50
      )
      .find((el) => el.className.includes("ingredient-section"));
    if (el) {
      const index = el.getAttribute("data-index");
      if (!index) {
        return;
      }
      setTabIdx(+index);
    }
  }, []);

  if (isLoading) {
    return <LoadingMessage />;
  }

  if (error || !data) {
    return (
      <ErrorMessage
        message="Ошибка получения компонентов"
        error={error}
      />
    );
  }

  const tabs = IngredientNames.map(([typeName, typeDesc], idx) => {
    return (
      <Tab
        value={String(idx)}
        active={idx === tabIdx}
        key={typeName}
        onClick={scrollIntoSection}
      >
        {typeDesc}
      </Tab>
    );
  });

  const sections = IngredientNames.map(([typeName, typeDesc], index) => {
    return (
      <IngredientsSection
        name={typeDesc}
        key={typeName}
        className="ingredient-section"
        index={index}
        ingredients={data.byType[typeName]}
      />
    );
  });

  return (
    <section className={cs.ingredients}>
      <h1 className="text text_type_main-large mt-10">Соберите бургер</h1>
      <div className={cx("mt-5", cs.tabs)}>{tabs}</div>
      <div
        className={cx("mt-10", cs.sections)}
        onScroll={handleScroll}
        ref={scroller}
      >
        {sections}
      </div>
    </section>
  );
};

export default BurgerIngredients;
