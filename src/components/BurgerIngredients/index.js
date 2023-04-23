import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import { useCallback, useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { combineClasses } from '../../utils';
import IngredientsSection from '../IngredientsSection';

import cs from './styles.module.css';
import { useGetIngredientsByTypeQuery } from '../../services/api';
import { setDefaultBun } from '../../services/burger';
import { bunType, ingredientTypes } from '../../helpers/ingredientTypes';

const BurgerIngredients = () => {
  const scroller = useRef();
  const [tabIdx, setTabIdx] = useState(0);

  const { data, error, isLoading } = useGetIngredientsByTypeQuery();
  const firstTime = useRef(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (firstTime.current && data) {
      dispatch(setDefaultBun(data[bunType]?.[0] ?? null));
      firstTime.current = false;
    }
  }, [isLoading, data, dispatch])

  const scrollIntoSection = useCallback(
    (idx) => {
      const section = scroller.current.children[idx];
      section.scrollIntoView();
      setTabIdx(idx);
    },
    [scroller]
  );

  const handleScroll = useCallback(() => {
    const el = document
      .elementsFromPoint(
        scroller.current.offsetLeft + 10,
        scroller.current.offsetTop + 50
      )
      .find((el) => el.className.includes('ingredient-section'));
    if (el) {
      setTabIdx(+el.getAttribute('data-index'));
    }
  }, [scroller]);

  if (isLoading) {
    return 'Загрузка...';
  }

  if (error) {
    return `Ошибка: ${error}`;
  }

  const tabs = ingredientTypes.map(([typeName, typeDesc], idx) => {
    return (
      <Tab
        value={idx}
        active={idx === tabIdx}
        key={typeName}
        onClick={scrollIntoSection}
      >
        {typeDesc}
      </Tab>
    );
  });

  const sections = ingredientTypes.map(([typeName, typeDesc], index) => {
    return (
      <IngredientsSection
        type={typeName}
        name={typeDesc}
        key={typeName}
        className='ingredient-section'
        index={index}
        ingredients={data[typeName]}
      />
    );
  });

  return (
    <section className={cs.ingredients}>
      <h1 className='text text_type_main-large mt-10'>Соберите бургер</h1>
      <div className={combineClasses('mt-5', cs.tabs)}>{tabs}</div>
      <div
        className={combineClasses('mt-10', cs.sections)}
        onScroll={handleScroll}
        ref={scroller}
      >
        {sections}
      </div>
    </section>
  );
};

export default BurgerIngredients;
