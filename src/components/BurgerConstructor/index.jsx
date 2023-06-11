import { useCallback } from "react";
import { Button } from "@ya.praktikum/react-developer-burger-ui-components";
import { cx } from "../../utils";
import BurgerComponent from "../BurgerComponent";
import cs from "./styles.module.css";
import { useModal } from "../../providers/ModalProvider";
import OrderCompleted from "../OrderCompleted";
import BurgerDropZone from "../BurgerDropZone";
import { useBunAndTotalPrice } from "../../services/burger";
import PriceTag from "../PriceTag";

const BurgerConstructor = () => {
  const [bun, totalPrice] = useBunAndTotalPrice();
  const showModal = useModal();
  const showInfo = useCallback(() => {
    showModal(null, <OrderCompleted />);
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
    burgerEl = <p className={"text text_type_main-default"}>Загрузка...</p>;
  }

  return (
    <section className={cx("pt-25 pl-4", cs.constructor)}>
      <div className={cs.burger}>{burgerEl}</div>
      <div className={cx("mt-10 mr-4", cs.footer)}>
        <PriceTag isMedium value={totalPrice} className="mr-10" />
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
