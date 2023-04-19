import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import { useCallback, useMemo, useRef, useState } from 'react';
import { combineClasses } from '../../utils';
import IngredientsSection from '../IngredientsSection';

import cs from './styles.module.css';

const types = [['bun', 'Булки'], ['sauce', 'Соусы'], ['main', 'Начинки']];

const BurgerIngredients = () => {
  const scroller = useRef();
  const [tabIdx, setTabIdx] = useState(0);

  const scrollIntoSection = useCallback((idx) => {
    const section = scroller.current.children[idx];
    section.scrollIntoView();
    setTabIdx(idx);
  }, [scroller])

  const handleScroll = useCallback(() => {
    const el = document.elementsFromPoint(scroller.current.offsetLeft + 10, scroller.current.offsetTop + 50)
      .find((el) => el.className.includes('ingredient-section'));
    if (el) {
      setTabIdx(+el.getAttribute('data-index'));
    }
  }, [scroller])

  const tabs = types.map(([typeName, typeDesc], idx) => {
    return <Tab value={idx} active={idx === tabIdx} key={typeName} onClick={scrollIntoSection}>{typeDesc}</Tab>;
  });

  const sections = useMemo(() => types.map(([typeName, typeDesc], index) => {
    return <IngredientsSection type={typeName} name={typeDesc} key={typeName} className='ingredient-section' index={index} />;
  }), []);

  return (
    <section className={cs.ingredients}>
      <h1 className='text text_type_main-large mt-10'>Соберите бургер</h1>
      <div className={combineClasses('mt-5', cs.tabs)}>
        {tabs}
      </div>
      <div className={combineClasses('mt-10', cs.sections)} onScroll={handleScroll} ref={scroller}>
        {sections}
      </div>
    </section>
  );
};

export default BurgerIngredients;
