import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const initialState = {
  bun: null,
  defaultBun: null,
  components: [],
};

export const burgerSlice = createSlice({
  name: "burger",
  initialState,
  reducers: {
    removeComponent: (state, action) => {
      state.components = state.components.filter(
        (_, idx) => idx !== action.payload
      );
    },
    setBun: (state, action) => {
      state.bun = action.payload;
    },
    setDefaultBun: (state, action) => {
      state.bun = action.payload;
      state.defaultBun = action.payload;
    },
    addIngredient: (state, action) => {
      const { startIdx, data } = action.payload;
      const array = [...state.components];
      array.splice(startIdx, 0, data);
      state.components = array;
    },
    moveIngredient: (state, action) => {
      let { oldIndex, newIndex } = action.payload;
      if (oldIndex === newIndex) {
        return;
      }
      const array = [...state.components];
      const data = array.splice(oldIndex, 1);
      if (oldIndex < newIndex) {
        newIndex -= 1;
      }
      array.splice(newIndex, 0, data[0]);
      state.components = array;
    },
    clearComponents: (state) => {
      state.bun = state.defaultBun;
      state.components = [];
    },
  },
});

export const {
  removeComponent,
  setBun,
  setDefaultBun,
  addIngredient,
  moveIngredient,
  clearComponents,
} = burgerSlice.actions;

const allComponentsSelector = createSelector(
  (state) => state.burger.bun,
  (state) => state.burger.components,
  (bun, components) => [bun._id, ...components.map((el) => el._id)]
);

export const useAllComponents = () => {
  return useSelector(allComponentsSelector);
};

const componentsSelector = createSelector(
  (state) => state.burger.components,
  (components) => components
);

export const useComponents = () => {
  return useSelector(componentsSelector);
};

const bunAndTotalPriceSelector = createSelector(
  (state) => state.burger.bun,
  (state) => state.burger.components,
  (bun, components) => {
    const totalPrice = components.reduce(
      (total, el) => total + el.price,
      bun?.price ?? 0
    );
    return [bun, totalPrice];
  }
);

export const useBunAndTotalPrice = () => {
  return useSelector(bunAndTotalPriceSelector);
};

const componentsCountSelector = createSelector(
  [
    (state) => [state.burger.bun, state.burger.components],
    (_, id) => id,
  ],
  ([bun, components], id) => {
    if (bun?._id === id) {
      return 1;
    }
    return components.reduce((count, el) => count + (el._id === id ? 1 : 0), 0);
  }
);

export const useUsedComponentCount = (id) => {
  return useSelector((state) => componentsCountSelector(state, id));
};

export default burgerSlice.reducer;
