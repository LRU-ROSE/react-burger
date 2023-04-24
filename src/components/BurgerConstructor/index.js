import { useCallback } from "react";
import {
  CurrencyIcon,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { combineClasses } from "../../utils";
import BurgerComponent from "../BurgerComponent";
import cs from "./styles.module.css";
import { useModal } from "../../providers/ModalProvider";
import OrderDetails from "../OrderDetails";
import BurgerDropZone from "../BurgerDropZone";
import { useBunAndTotalPrice } from "../../services/burger";

const BurgerConstructor = () => {
  const [bun, totalPrice] = useBunAndTotalPrice();
  const showModal = useModal();
  const showInfo = useCallback(() => {
    showModal(null, <OrderDetails />);
  }, [showModal]);

  let burgerEl;
  if (bun) {
    burgerEl = (
      <>
        <BurgerComponent component={bun} type="top" />
        <BurgerDropZone />
        <BurgerComponent component={bun} type="bottom" />
      </>
    );
  } else {
    burgerEl = (
      <p className={"text text_type_main-default"}>
        Загрузка...
      </p>
    );
  }

  return (
    <section className={combineClasses("pt-25 pl-4", cs.constructor)}>
      <div className={cs.burger}>{burgerEl}</div>
      <div className={combineClasses("mt-10 mr-4", cs.footer)}>
        <div className={combineClasses("mr-10", cs.totalPrice)}>
          <p className="text text_type_digits-medium mr-2">{totalPrice}</p>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={showInfo}
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

export default BurgerConstructor;
