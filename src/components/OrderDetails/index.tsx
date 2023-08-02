import { cx } from "../../utils";

import cs from "./styles.module.css";

import IngredientIcon from "../IngredientIcon";
import PriceTag from "../PriceTag";
import { useGetIngredientsQuery } from "../../services/api/ingredientsApi";
import StatusText from "../StatusText";
import { FormattedDate } from "@ya.praktikum/react-developer-burger-ui-components";
import { OrderType } from "../../types/order";
import { useMemo } from "react";
import LoadingMessage from "../LoadingMessage";
import ErrorMessage from "../ErrorMessage";

type Props = {
  order: OrderType;
  className?: string;
}

const OrderDetails = ({ order, className }: Props) => {
  const { data, error, isLoading } = useGetIngredientsQuery();

  const byId = data?.byId;
  const [priceEl, ingrEls] = useMemo(() => {
    if (!byId) {
      return [null, null];
    }
    const total = order.ingredients.reduce((total, id) => {
      return total + byId[id].price;
    }, 0);

    const uniqueInrs = order.ingredients.reduce((rv, ingrId) => {
      rv.set(ingrId, (rv.get(ingrId) ?? 0) + 1);
      return rv;
    }, new Map());

    const ingrEls = Array.from(uniqueInrs.entries(), ([ingrId, count]) => {
      const ingr = byId[ingrId];
      return (
        <li key={ingrId} className={cs.listItem}>
          <IngredientIcon
            className={cs.icon}
            src={ingr.image_mobile}
            name={ingr.name}
          />
          <p className={cx("text text_type_main-default", cs.ingrTitle)}>
            {ingr.name}
          </p>
          <PriceTag value={`${count} x ${ingr.price}`} className={cs.price} />
        </li>
      );
    });

    const priceEl = <PriceTag value={total} className={cs.price} />;

    return [priceEl, ingrEls];
  }, [order, byId]);

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
    <div className={cx(cs.details, className)}>
      <p
        className={cx("text text_type_digits-default", cs.number)}
      >{`#${order.number.toString().padStart(6, "0")}`}</p>
      <p className={cx("text text_type_main-medium", cs.name)}>{order.name}</p>
      <StatusText className={cs.status} status={order.status} />
      <p className={cx("text text_type_main-medium", cs.ingreds)}>Состав</p>
      <ul className={cs.components}>{ingrEls}</ul>
      <FormattedDate
        className={cx(
          "text text_type_main-default text_color_inactive",
          cs.date
        )}
        date={new Date(order.createdAt)}
      />
      {priceEl}
    </div>
  );
};

export default OrderDetails;
