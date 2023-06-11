import { useState } from "react";
import { cx } from "../../utils";

import cs from "./styles.module.css";

import { useGetAllOrdersQuery } from "../../services/api/orders";
import OrdersList from "../../components/OrdersList";

const OrdersFeedPage = () => {
  const [intl] = useState(() => new Intl.NumberFormat("ru"));
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

  const ready = [];
  const inProgress = [];

  for (let i = 0; i < data.length; i += 1) {
    const order = data[i];
    if (order.status === "done") {
      if (ready.length > 5) {
        if (inProgress.length > 5) {
          break;
        }
        continue;
      }
      ready.push(order);
    } else if (order.status === "pending") {
      if (inProgress.length > 5) {
        if (ready.length > 5) {
          break;
        }
        continue;
      }
      inProgress.push(order);
    }
  }

  return (
    <div className={cs.feed}>
      <OrdersList orders={data} className={cs.list} baseUrl="/feed" />
      <div className={cs.statistics}>
        <h2 className={cx("text text_type_main-medium", cs.readyh)}>Готовы:</h2>
        <ul className={cx(cs.ready, cs.statList)}>
          {ready.map((el) => {
            return (
              <li
                className="text text_type_digits-default text_color_inactive"
                key={el._id}
              >
                {el.number.toString().padStart(6, "0")}
              </li>
            );
          })}
        </ul>
        <h2 className={cx("text text_type_main-medium", cs.inprogressh)}>
          В работе:
        </h2>
        <ul className={cx(cs.inpr, cs.statList)}>
          {inProgress.map((el) => {
            return (
              <li className="text text_type_digits-default" key={el._id}>
                {el.number.toString().padStart(6, "0")}
              </li>
            );
          })}
        </ul>
        <h2 className={cx("text text_type_main-medium", cs.allh)}>
          Выполнено за все время:
        </h2>
        <p className={cx("text text_type_digits-large", cs.all, cs.glowText)}>
          {intl.format(28752)}
        </p>
        <h2 className={cx("text text_type_main-medium", cs.todh)}>
          Выполнено за сегодня:
        </h2>
        <p className={cx("text text_type_digits-large", cs.tod, cs.glowText)}>
          {intl.format(138)}
        </p>
      </div>
    </div>
  );
};

export default OrdersFeedPage;
