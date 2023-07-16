import { useState, useCallback, FormEvent } from "react";

import cs from "./styles.module.css";
import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { NavLink, Navigate, useSearchParams } from "react-router-dom";
import { useLoginMutation } from "../../services/api/authApi";
import { cx } from "../../utils";
import { getErrorMessage } from "../../helpers/UserRequiredError";

const LoginPage = () => {
  const [returnPath] = useSearchParams('return');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pasVisible, setPasVisible] = useState(false);
  const changeType = useCallback(() => {
    setPasVisible(!pasVisible);
  }, [pasVisible]);

  const [login, result] = useLoginMutation();
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  if (result.isSuccess) {
    return <Navigate to={ returnPath.get('return') || "/" } replace />;
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
        {getErrorMessage(result.error)}
      </p>
    );
  }
  return (
    <form action="#" method="post" className={cs.form} onSubmit={onSubmit}>
      <h2 className="text text_type_main-medium">Вход</h2>
      {errorEl}
      <Input
        type="email"
        required
        placeholder="E-mail"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        name={"email"}
        size={"default"}
        extraClass="mt-6"
      />
      <Input
        type={pasVisible ? "text" : "password"}
        required
        placeholder="Пароль"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        name={"password"}
        size={"default"}
        icon={pasVisible ? "HideIcon" : "ShowIcon"}
        onIconClick={changeType}
        extraClass="mt-6"
      />
      <Button htmlType="submit" type="primary" size="large" extraClass="mt-6">
        Войти
      </Button>
      <p className="text text_type_main-small text_color_inactive mt-20">
        Вы — новый пользователь?{" "}
        <NavLink className={cs.link} to="/register">
          Зарегистрироваться
        </NavLink>
      </p>
      <p className="text text_type_main-small text_color_inactive mt-4">
        Забыли пароль?{" "}
        <NavLink className={cs.link} to="/forgot-password">
          Восстановить пароль
        </NavLink>
      </p>
    </form>
  );
};

export default LoginPage;
