import { NavLink } from "react-router-dom";
import { cx } from "../../utils";

import cs from "./styles.module.css";
import LogoutButton from "../../components/LogoutButton/LogoutButton";

const ProfileLayout = ({ children, description }) => {
  return (
    <div className={cs.profile}>
      <div className={cs.navigation}>
        <ul className={cs.list}>
          <li className={cs.listItem}>
            <NavLink
              end
              to="/profile"
              className={cx("text text_type_main-medium", cs.link)}
            >
              Профиль
            </NavLink>
          </li>
          <li className={cs.listItem}>
            <NavLink
              to="/profile/orders"
              className={cx("text text_type_main-medium", cs.link)}
            >
              История заказов
            </NavLink>
          </li>
          <li className={cs.listItem}>
            <LogoutButton
              className={cx("text text_type_main-medium", cs.button)}
            >
              Выход
            </LogoutButton>
          </li>
        </ul>
        <p
          className={cx(
            "text text_type_main-small text_color_inactive mt-20",
            cs.info
          )}
        >
          {description}
        </p>
      </div>
      {children}
    </div>
  );
};

export default ProfileLayout;
