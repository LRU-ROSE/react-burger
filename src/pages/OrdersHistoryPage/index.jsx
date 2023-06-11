import cs from "./styles.module.css";

import { useGetOrdersQuery } from "../../services/api/orders";
import OrdersList from "../../components/OrdersList";
import ProfileLayout from "../../components/ProfileLayout";

const OrdersHistoryPage = () => {
  const { data, error, isLoading } = useGetOrdersQuery();

  if (error) {
    return (
      <p className="text text_type_main-medium mt-8">
        Ошибка получения заказов...
      </p>
    );
  }

  if (isLoading || !data) {
    return <p className="text text_type_main-medium mt-8">Загрузка...</p>;
  }

  return (
    <ProfileLayout description="В этом разделе вы можете просмотреть свою историю заказов">
      <OrdersList orders={[...data].reverse()} className={cs.list} showStatus baseUrl="/profile/orders" />
    </ProfileLayout>
  );
};

export default OrdersHistoryPage;
