import { useParams } from "react-router-dom";

import cs from "./styles.module.css";
import OrderDetails from "../../components/OrderDetails";
import { useGetAllOrdersQuery } from "../../services/api/orders";

const FeedDetailsPage = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetAllOrdersQuery();

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

  const order = data.find((el) => el._id === id);
  if (!order) {
    return <p className="text text_type_main-medium mt-8">Заказ не найден...</p>;
  }

  return (
    <OrderDetails className={cs.details} order={order} />
  );
};

export default FeedDetailsPage;
