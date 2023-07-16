import cs from "./styles.module.css";
import { cx } from "../../utils";
import { OrderStatus } from "../../types/order";

const statuses: Record<OrderStatus, string> = {
  done: "Выполнен",
  pending: "Готовится",
  created: "Создан",
};

type Props = {
  className?: string;
  status: OrderStatus;
}

const StatusText = ({ className, status }: Props) => {
  return (
    <p className={cx(cs.status, className, status === "done" && cs.statusDone)}>
      {statuses[status]}
    </p>
  );
};

export default StatusText;
