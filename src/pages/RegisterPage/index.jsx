import { useState, useCallback } from "react";

import cs from "./styles.module.css";
import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { NavLink, Navigate } from "react-router-dom";
import { useRegisterMutation } from "../../services/api/authApi";
import { cx } from "../../utils";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pasVisible, setPasVisible] = useState(false);
  const changeType = useCallback(() => {
    setPasVisible(!pasVisible);
  }, [pasVisible]);

  const [register, result] = useRegisterMutation();
  const onSubmit = (e) => {
    e.preventDefault();
    register({ name, email, password });
  };

  if (result.isSuccess) {
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
      <h2 className="text text_type_main-medium">Регистрация</h2>
      {errorEl}
      <Input
        type="text"
        required
        placeholder="Имя"
        onChange={(e) => setName(e.target.value)}
        value={name}
        name={"name"}
        size={"default"}
        extraClass="mt-6"
      />
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
        Зарегистрироваться
      </Button>
      <p className="text text_type_main-small text_color_inactive mt-20">
        Уже зарегистрированы?{" "}
        <NavLink className={cs.link} to="/login">
          Войти
        </NavLink>
      </p>
    </form>
  );
};

export default RegisterPage;
