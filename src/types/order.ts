export const enum OrderStatus {
  Done = "done",
  Pending = "pending",
  Created = "created",
}

export type OrderType = {
  _id: string;
  name: string;
  number: number;
  status: OrderStatus;
  createdAt: string;
  ingredients: string[];
};
