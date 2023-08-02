import { FormattedDate } from "@ya.praktikum/react-developer-burger-ui-components";
import cs from "./styles.module.css";
import { cx } from "../../utils";
import PriceTag from "../PriceTag";
import { Link } from "react-router-dom";
import IngredientIcon from "../IngredientIcon";
import StatusText from "../StatusText";
import { OrderType } from "../../types/order";
import { Ingredient } from "../../types/Ingredient";
import { MouseEvent } from "react";

type Props = {
  order: OrderType;
  ingredients: Record<string, Ingredient>;
  baseUrl: string;
  onClick: (e: MouseEvent<never>) => void;
  showStatus?: boolean;
};

const OrderItem = ({
  order,
  ingredients,
  baseUrl,
  onClick,
  showStatus = false,
}: Props) => {
  const extraComponents =
    order.ingredients.length > 6 ? order.ingredients.length - 6 : undefined;
  const total = order.ingredients.reduce((total, id) => {
    return total + ingredients[id].price;
  }, 0);

  return (
    <Link className={cs.link} to={`${baseUrl}/${order._id}`} onClick={onClick}>
      <article className={cs.item}>
        <p
          className={cx("text text_type_digits-default", cs.number)}
        >{`#${order.number.toString().padStart(6, "0")}`}</p>
        <FormattedDate
          className={cx(
            "text text_type_main-default text_color_inactive",
            cs.date
          )}
          date={new Date(order.createdAt)}
        />
        <p className={cx("text text_type_main-medium", cs.name)}>
          {order.name}
        </p>
        {showStatus && (
          <div className={cs.status}>
            <StatusText status={order.status} />
          </div>
        )}
        <ul className={cs.ingredients}>
          {order.ingredients
            .slice(0, 6)
            .reverse()
            .map((ingrId, idx) => {
              const dataAttr = idx === 0 ? extraComponents : undefined;
              const ingr = ingredients[ingrId];
              return (
                <li key={`${idx}${ingrId}`} className={cs.ingredient}>
                  <IngredientIcon
                    className={cs.ingredientIcon}
                    src={ingr.image_mobile}
                    name={ingr.name}
                    moreData={dataAttr}
                  />
                </li>
              );
            })}
        </ul>
        <PriceTag value={total} className={cs.price} />
      </article>
    </Link>
  );
};

export default OrderItem;
