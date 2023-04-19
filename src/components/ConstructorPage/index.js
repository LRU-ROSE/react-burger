import { combineClasses } from '../../utils';
import BurgerConstructor from '../BurgerConstructor';
import BurgerIngredients from '../BurgerIngredients';
import cs from './styles.module.css';

const ConstructorPage = () => {
  return (
    <main className={combineClasses(cs.page, 'mb-10')}>
      <BurgerIngredients />
      <BurgerConstructor />
    </main>
  );
};

export default ConstructorPage;
