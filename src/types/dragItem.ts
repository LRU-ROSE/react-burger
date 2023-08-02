import { Ingredient } from "./Ingredient";

export type DragItem =
  | { isNew: true; data: Ingredient }
  | { isNew: false; data: Ingredient; index: number };
