import { createContext, useCallback, useContext, useReducer, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Ingredient from '../types/Ingredient';

const initData = {
  ingredients: {
    ingredientsByType: null,
    ingredientsById: null,
  },
  burger: {
    bun: null,
    components: [
      '60d3b41abdacab0026a733ce',
      '60d3b41abdacab0026a733c9',
      '60d3b41abdacab0026a733d1',
      '60d3b41abdacab0026a733d0',
      '60d3b41abdacab0026a733d0',
      '60d3b41abdacab0026a733d2',
      '60d3b41abdacab0026a733d3',
      '60d3b41abdacab0026a733d3',
      '60d3b41abdacab0026a733d3',
    ],
    totalPrice: 0,
  }
};

const BurgerContext = createContext({
  data: initData,
  removeIngredient: () => undefined,
  countComponents: () => undefined,
});

export const useIngredientsByType = (type) => {
  const { ingredientsByType } = useContext(BurgerContext).data.ingredients;
  return ingredientsByType ? ingredientsByType[type] : null;
};

export const useIngredientById = (id) => {
  const { ingredientsById } = useContext(BurgerContext).data.ingredients;
  return ingredientsById ? ingredientsById[id] : null;
};

export const useBurgerCounter = (id) => {
  return useContext(BurgerContext).countComponents(id);
};

export const useBurgerModifier = () => {
  const {setBun, addIngredient, removeIngredient, data: { burger: {bun, components, totalPrice}}} = useContext(BurgerContext);
  return {bun, components, totalPrice, setBun, addIngredient, removeIngredient};
};

const computeIngredients = (ingredients) => {
  return ingredients.reduce(([dataByType, dataById], obj) => {
    if (dataByType[obj.type]) {
      dataByType[obj.type].push(obj);
    } else {
      dataByType[obj.type] = [obj];
    }
    dataById[obj._id] = obj;
    return [dataByType, dataById];
  }, [{}, {}])
};

const setIngredients = (state, ingredients) => {
  if (!ingredients) {
    return state;
  }
  const [ingredientsByType, ingredientsById] = computeIngredients(ingredients);

  // Устанавливаем булочку по-умолчанию
  let bun = state.burger.bun;
  if (!bun) {
    const bunItem = ingredientsByType['bun'][0];
    bun = bunItem._id;
  }

  // Обновляем цену бургера
  let totalPrice = state.burger.components.reduce((total, id) => total + ingredientsById[id].price, ingredientsById[bun].price * 2);

  return {
    ...state,
    burger: {
      ...state.burger,
      bun,
      totalPrice,
    },
    ingredients: {
      ingredientsByType,
      ingredientsById,
    },
  };
};

const burgerReducer = (state, { type, data }) => {
  switch (type) {
    case 'remove-component': {
      const components = state.burger.components.filter((_, idx) => idx !== data);
      return {
        ...state,
        burger: {
          ...state.burger,
          components,
          totalPrice: state.burger.totalPrice - state.ingredients.ingredientsById[state.burger.components[data]].price,
        },
      };
    }
    case 'set-ingredients': {
      return setIngredients(state, data);
    }
    default:
      return state;
  }
};

const BurgerProvider = ({ ingredients, children }) => {
  const [data, dispatch] = useReducer(burgerReducer, initData, (state) => setIngredients(state, ingredients));

  const removeIngredient = useCallback((index) => {
    dispatch({ type: 'remove-component', data: index});
  }, []);

  const countComponents = useCallback((id) => {
    if (id === data.burger.bun) {
      return 1;
    }
    return data.burger.components.reduce((count, val) => count + (id === val ? 1 : 0), 0);
  }, [data]);

  const context = useMemo(() => {
    return { data, removeIngredient, countComponents };
  }, [data, removeIngredient, countComponents]);

  useEffect(() => {
    dispatch({ type: 'set-ingredients', data: ingredients});
  }, [ingredients]);

  return (
    <BurgerContext.Provider value={context}>
      {children}
    </BurgerContext.Provider>
  );
};

BurgerProvider.propTypes = {
  ingredients: PropTypes.arrayOf(Ingredient.isRequired), // Необязательный - при инициализации их может не быть
};

export default BurgerProvider;
