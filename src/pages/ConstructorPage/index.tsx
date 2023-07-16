import { cx } from '../../utils';
import BurgerConstructor from '../../components/BurgerConstructor';
import BurgerIngredients from '../../components/BurgerIngredients';
import cs from './styles.module.css';

const ConstructorPage = () => {
  return (
    <main className={cx(cs.page, 'mb-10')}>
      <BurgerIngredients />
      <BurgerConstructor />
    </main>
  );
};

export default ConstructorPage;
