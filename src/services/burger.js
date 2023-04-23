import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = {
  bun: null,
  defaultBun: null,
  components: [],
  totalPrice: 0,
};

function computeTotalPrice(state) {
  return state.components.reduce(
    (total, el) => total + el.price,
    state.bun?.price ?? 0
  );
}

export const burgetSlice = createSlice({
  name: "burger",
  initialState,
  reducers: {
    removeComponent: (state, action) => {
      state.components = state.components.filter((_, idx) => idx !== action.payload);
      state.totalPrice = computeTotalPrice(state);
    },
    setBun: (state, action) => {
      state.bun = action.payload;
      state.totalPrice = computeTotalPrice(state);
    },
    setDefaultBun: (state, action) => {
      state.bun = action.payload;
      state.defaultBun = action.payload;
      state.totalPrice = computeTotalPrice(state);
    },
    addIngredient: (state, action) => {
      const { startIdx, data } = action.payload;
      const array = [...state.components];
      array.splice(startIdx, 0, data);
      state.components = array;
      state.totalPrice = computeTotalPrice(state);
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
      state.totalPrice = computeTotalPrice(state);
    }
  },
});


export const {
  removeComponent,
  setBun,
  setDefaultBun,
  addIngredient,
  moveIngredient,
  clearComponents,
} = burgetSlice.actions;

export const useAllComponents = () => {
  return useSelector((state) => {
    return [
      state.burger.bun._id,
      ...state.burger.components.map((el) => el._id),
    ];
  });
};

export const useComponents = () => {
  return useSelector((state) => state.burger.components);
};

export const useBunAndTotalPrice = () => {
  return useSelector((state) => [
    state.burger.bun,
    state.burger.totalPrice,
  ]);
};

export const useUsedComponentCount = (id) => {
  return useSelector((state) => {
    if (state.burger.bun?._id === id) {
      return 1;
    }
    return state.burger.components.reduce(
      (count, el) => count + (el._id === id ? 1 : 0),
      0
    );
  });
};

export default burgetSlice.reducer;
