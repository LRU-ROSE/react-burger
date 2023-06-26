import { useState } from "react";

import cs from "./styles.module.css";
import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { NavLink, Navigate } from "react-router-dom";
import { cx } from "../../utils";
import { useStartResetPasswordMutation } from "../../services/api/authApi";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const [resetPassword, result] = useStartResetPasswordMutation();
  const onSubmit = (e) => {
    e.preventDefault();
    resetPassword({ email });
  };

  if (result.isSuccess) {
    return <Navigate to="/reset-password" replace />;
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
        type="email"
        required
        placeholder="Укажите e-mail"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        name={"email"}
        size={"default"}
        extraClass="mt-6"
      />
      <Button htmlType="submit" type="primary" size="large" extraClass="mt-6">
        Восстановить
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

export default ForgotPasswordPage;
