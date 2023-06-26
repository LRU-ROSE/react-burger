import { useEffect } from "react";

import cs from "./styles.module.css";

import { useGetOrdersQuery, useCloseOrdersQuery } from "../../services/api/orders";
import OrdersList from "../../components/OrdersList";
import ProfileLayout from "../../components/ProfileLayout";
import LoadingMessage from "../../components/LoadingMessage";
import ErrorMessage from "../../components/ErrorMessage";

const OrdersHistoryPage = () => {
  const { data, error, isLoading } = useGetOrdersQuery();
  const close = useCloseOrdersQuery();
  useEffect(() => close, [close]);

  if (error) {
    return <ErrorMessage message="Ошибка получения заказов" error={error} />;
  }

  if (isLoading || !data) {
    return <LoadingMessage />;
  }

  return (
    <ProfileLayout description="В этом разделе вы можете просмотреть свою историю заказов">
      <OrdersList orders={[...data].reverse()} className={cs.list} showStatus baseUrl="/profile/orders" />
    </ProfileLayout>
  );
};

export default OrdersHistoryPage;
