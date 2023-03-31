import { useState, useEffect } from 'react';
import { getIngredients } from '../../api/ingredients';
import BurgerProvider from '../../providers/BurgerProvider';
import ModalProvider from '../../providers/ModalProvider';
import AppHeader from '../AppHeader';
import ConstructorPage from '../ConstructorPage';

const App = () => {
  const [ingredients, setIngredients] = useState(null);
  useEffect(() => {
    let aborted = false;
    getIngredients()
      .then(val => {
        if (!aborted) {
          setIngredients(val.data);
        }
      })
      .catch((e) => console.log(`Ошибка загрузки компонентов: ${e}`));
    return () => { aborted = true; };
  }, [])
  return (
    <BurgerProvider ingredients={ingredients}>
      <ModalProvider>
        <AppHeader />
        <ConstructorPage />
      </ModalProvider>
    </BurgerProvider>
  );
};

export default App;
