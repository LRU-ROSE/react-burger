import PropTypes from "prop-types";

import cs from "./styles.module.css";
import { cx } from "../../utils";
import { OrderStatus } from "../../types/order";

const statuses = {
  done: "Выполнен",
  pending: "Готовится",
  created: "Создан",
};

const StatusText = ({ className, status }) => {
  return (
    <p className={cx(cs.status, className, status === "done" && cs.statusDone)}>
      {statuses[status]}
    </p>
  );
};

StatusText.propTypes = {
  className: PropTypes.string,
  status: OrderStatus.isRequired,
};

export default StatusText;
