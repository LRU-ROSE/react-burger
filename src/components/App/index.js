import { useState, useEffect } from 'react';
import { getIngredients } from '../../api/ingredients';
import BurgerProvider from '../../providers/BurgerProvider';
import ModalProvider from '../../providers/ModalProvider';
import AppHeader from '../AppHeader';
import ConstructorPage from '../ConstructorPage';
import cs from './styles.module.css';

const App = () => {
  const [ingredients, setIngredients] = useState(null);
  useEffect(() => {
    const abort = new AbortController();
    getIngredients(abort.signal)
      .then(val => setIngredients(val.data))
      .catch((e) => {
        if (e.name === 'AbortError') {
          return;
        }
        console.log(`Ошибка загрузки компонентов: ${e}`)
      });
    return () => abort.abort();
  }, [])
  return (
    <BurgerProvider ingredients={ingredients}>
      <ModalProvider>
        <div className={cs.root}>
          <AppHeader />
          <ConstructorPage />
        </div>
      </ModalProvider>
    </BurgerProvider>
  );
};

export default App;
