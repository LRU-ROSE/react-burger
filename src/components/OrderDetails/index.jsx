import PropTypes from 'prop-types';

import { cx } from "../../utils";

import cs from "./styles.module.css";

import { isUserRequiredError } from "../../helpers/UserRequiredError";
import GotoLogin from "../GotoLogin";
import IngredientIcon from "../IngredientIcon";
import PriceTag from "../PriceTag";
import { useGetIngredientsQuery } from "../../services/api/ingredientsApi";
import StatusText from "../StatusText";
import { FormattedDate } from "@ya.praktikum/react-developer-burger-ui-components";
import { OrderType } from '../../types/order';

const OrderDetails = ({ order, className }) => {
  const { data, error, isLoading } = useGetIngredientsQuery();

  if (isLoading) {
    return (
      <p className={cx("text text_type_main-medium mt-8", className)}>
        Загрузка...
      </p>
    );
  }
  if (error || !data) {
    if (isUserRequiredError(error)) {
      return <GotoLogin />;
    }
    return (
      <p className={cx("text text_type_main-medium mt-8", className)}>
        Ошибка получения компонентов...
      </p>
    );
  }

  const total = order.ingredients.reduce((total, id) => {
    return total + data.byId[id].price;
  }, 0);

  const uniqueInrs = order.ingredients.reduce((rv, ingrId) => {
    rv.set(ingrId, (rv.get(ingrId) ?? 0) + 1);
    return rv;
  }, new Map());

  return (
    <div className={cx(cs.details, className)}>
      <p
        className={cx("text text_type_digits-default", cs.number)}
      >{`#${order.number.toString().padStart(6, "0")}`}</p>
      <p className={cx("text text_type_main-medium", cs.name)}>{order.name}</p>
      <StatusText className={cs.status} status={order.status} />
      <p className={cx("text text_type_main-medium", cs.ingreds)}>Состав</p>
      <ul className={cs.components}>
        {Array.from(uniqueInrs.entries(), ([ingrId, count]) => {
          const ingr = data.byId[ingrId];
          return (
            <li key={ingrId} className={cs.listItem}>
              <IngredientIcon
                className={cs.icon}
                src={ingr.image_mobile}
                name={ingr.name}
              />
              <p className={cx("text text_type_main-default", cs.ingrTitle)}>{ingr.name}</p>
              <PriceTag
                value={`${count} x ${ingr.price}`}
                className={cs.price}
              />
            </li>
          );
        })}
      </ul>
      <FormattedDate
        className={cx(
          "text text_type_main-default text_color_inactive",
          cs.date
        )}
        date={new Date(order.createdAt)}
      />
      <PriceTag value={total} className={cs.price} />
    </div>
  );
};

OrderDetails.propTypes = {
  className: PropTypes.string,
  order: OrderType.isRequired,
};

export default OrderDetails;
