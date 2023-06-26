import { useEffect } from "react";
import { useParams } from "react-router-dom";

import cs from "./styles.module.css";
import OrderDetails from "../../components/OrderDetails";
import { useGetOrdersQuery, useCloseOrdersQuery } from "../../services/api/orders";
import LoadingMessage from "../../components/LoadingMessage";
import ErrorMessage from "../../components/ErrorMessage";

const HistoryDetailsPage = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetOrdersQuery();
  const close = useCloseOrdersQuery();
  useEffect(() => close, [close]);

  if (error) {
    return <ErrorMessage message="Ошибка получения заказов" error={error} />;
  }

  if (isLoading || !data) {
    return <LoadingMessage />;
  }

  const order = data.find((el) => el._id === id);
  if (!order) {
    return <p className="text text_type_main-medium mt-8">Заказ не найден...</p>;
  }

  return (
    <OrderDetails className={cs.details} order={order} />
  );
};

export default HistoryDetailsPage;
