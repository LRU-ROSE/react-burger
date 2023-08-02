import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Ingredient } from "../types/Ingredient";

import type { RootState } from "./index";

type BurgerState = {
  bun: Ingredient | null;
  defaultBun: Ingredient | null;
  components: Ingredient[];
};

const initialState: BurgerState = {
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
  (state: RootState) => state.burger.bun,
  (state: RootState) => state.burger.components,
  (bun, components) => {
    const rv = components.map((el) => el._id);
    if (bun?._id) {
      rv.push(bun._id);
    }
    return rv;
  }
);

export const useAllComponents = () => {
  return useSelector(allComponentsSelector);
};

const componentsSelector = createSelector(
  (state: RootState) => state.burger.components,
  (components) => components
);

export const useComponents = () => {
  return useSelector(componentsSelector);
};

const bunAndTotalPriceSelector = createSelector(
  (state: RootState) => state.burger.bun,
  (state: RootState) => state.burger.components,
  (bun, components) => {
    const totalPrice = components.reduce(
      (total, el) => total + el.price,
      bun?.price ?? 0
    );
    return [bun, totalPrice] as const;
  }
);

export const useBunAndTotalPrice = () => {
  return useSelector(bunAndTotalPriceSelector);
};

const componentsCountSelector = createSelector(
  [
    (state: RootState) => [state.burger.bun, state.burger.components] as const,
    (_: RootState, id: string) => id,
  ],
  ([bun, components], id) => {
    if (bun?._id === id) {
      return 1;
    }
    return components.reduce((count, el) => count + (el._id === id ? 1 : 0), 0);
  }
);

export const useUsedComponentCount = (id: string) => {
  return useSelector((state: RootState) => componentsCountSelector(state, id));
};

export default burgerSlice.reducer;
