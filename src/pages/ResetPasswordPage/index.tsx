import { useState, useCallback, FormEvent } from "react";

import cs from "./styles.module.css";
import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { NavLink, Navigate } from "react-router-dom";
import { cx } from "../../utils";
import { useEndResetPasswordMutation } from "../../services/api/authApi";
import { useResettingPassword } from "../../services/auth";

const ResetPasswordPage = () => {
  const isResetting = useResettingPassword();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [pasVisible, setPasVisible] = useState(false);
  const changeType = useCallback(() => {
    setPasVisible(!pasVisible);
  }, [pasVisible]);

  const [resetPassword, result] = useEndResetPasswordMutation();
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    resetPassword({ password, token });
  };

  if (result.isSuccess) {
    return <Navigate to="/login" replace />;
  }

  if (!isResetting) {
    return <Navigate to="/" replace />;
  }

  let errorEl = null;
  if (result.isError) {
    errorEl = (
      <p
        className={cx(
          "text text_type_main-small text_color_inactive mt-4",
          cs.error
        )}
      >
        {result.error.toString()}
      </p>
    );
  }
  return (
    <form action="#" method="post" className={cs.form} onSubmit={onSubmit}>
      <h2 className="text text_type_main-medium">Восстановление пароля</h2>
      {errorEl}
      <Input
        type={pasVisible ? "text" : "password"}
        required
        placeholder="Введите новый пароль"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        name={"password"}
        size={"default"}
        icon={pasVisible ? "HideIcon" : "ShowIcon"}
        onIconClick={changeType}
        extraClass="mt-6"
      />
      <Input
        type="text"
        required
        placeholder="Введите код из письма"
        onChange={(e) => setToken(e.target.value)}
        value={token}
        name={"token"}
        size={"default"}
        extraClass="mt-6"
      />
      <Button htmlType="submit" type="primary" size="large" extraClass="mt-6">
        Сохранить
      </Button>
      <p className="text text_type_main-small text_color_inactive mt-20">
        Вспомнили пароль?{" "}
        <NavLink className={cs.link} to="/login">
          Войти
        </NavLink>
      </p>
    </form>
  );
};

export default ResetPasswordPage;
