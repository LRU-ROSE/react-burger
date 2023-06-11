import { useState, useMemo, useEffect } from "react";
import { cx } from "../../utils";

import cs from "./styles.module.css";

import {
  useGetAllOrdersQuery,
  useCloseOrdersQuery,
} from "../../services/api/orders";
import OrdersList from "../../components/OrdersList";
import LoadingMessage from "../../components/LoadingMessage";
import ErrorMessage from "../../components/ErrorMessage";

const OrdersFeedPage = () => {
  const [intl] = useState(() => new Intl.NumberFormat("ru"));
  const { data, error, isLoading } = useGetAllOrdersQuery();
  const close = useCloseOrdersQuery();
  useEffect(() => close, [close]);

  const [readyEls, inProgressEls] = useMemo(() => {
    if (!data) {
      return [null, null];
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
        ready.push(
          <li
            className="text text_type_digits-default text_color_inactive"
            key={order._id}
          >
            {order.number.toString().padStart(6, "0")}
          </li>
        );
      } else if (order.status === "pending") {
        if (inProgress.length > 5) {
          if (ready.length > 5) {
            break;
          }
          continue;
        }
        inProgress.push(
          <li className="text text_type_digits-default" key={order._id}>
            {order.number.toString().padStart(6, "0")}
          </li>
        );
      }
    }

    return [ready, inProgress];
  }, [data]);

  if (error) {
    return <ErrorMessage message="Ошибка получения заказов" error={error} />;
  }

  if (isLoading || !data) {
    return <LoadingMessage />;
  }

  return (
    <div className={cs.feed}>
      <OrdersList orders={data} className={cs.list} baseUrl="/feed" />
      <div className={cs.statistics}>
        <h2 className={cx("text text_type_main-medium", cs.readyh)}>Готовы:</h2>
        <ul className={cx(cs.ready, cs.statList)}>{readyEls}</ul>
        <h2 className={cx("text text_type_main-medium", cs.inprogressh)}>
          В работе:
        </h2>
        <ul className={cx(cs.inpr, cs.statList)}>{inProgressEls}</ul>
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
