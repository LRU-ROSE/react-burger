import { cx } from "../../utils";

import cs from "./styles.module.css";

import { useGetIngredientsQuery } from "../../services/api/ingredientsApi";
import OrderItem from "../OrderItem";
import OrderDetails from "../OrderDetails";
import usePathModal from "../../helpers/usePathModal";
import { OrderType } from "../../types/order";
import LoadingMessage from "../LoadingMessage";
import ErrorMessage from "../ErrorMessage";
import { MouseEvent } from "react";

type ModalArg = {
  e: MouseEvent<never>;
  order: OrderType;
};

type Props = {
  orders: OrderType[];
  baseUrl: string;
  className?: string;
  showStatus?: boolean;
};

const OrdersList = ({
  orders,
  baseUrl,
  showStatus = false,
  className,
}: Props) => {
  const showInfo = usePathModal<ModalArg>(
    "Детали заказа",
    ({ e, order }) => {
      e.preventDefault();
      return <OrderDetails order={order} />;
    },
    ({ order }) => `${baseUrl}/${order._id}`
  );
  const { data, error, isLoading } = useGetIngredientsQuery();

  if (isLoading) {
    return <LoadingMessage className={className} />;
  }
  if (error || !data) {
    return (
      <ErrorMessage
        className={className}
        message="Ошибка получения компонентов"
        error={error}
      />
    );
  }

  return (
    <ul className={cx(cs.list, className)}>
      {orders.map((order) => {
        return (
          <li key={order._id} className={cs.item}>
            <OrderItem
              order={order}
              showStatus={showStatus}
              ingredients={data.byId}
              baseUrl={baseUrl}
              onClick={(e) => showInfo({ e, order })}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default OrdersList;
