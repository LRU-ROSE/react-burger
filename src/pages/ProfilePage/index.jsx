import { useEffect } from "react";

import {
  Button,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { cx } from "../../utils";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../services/api/userApi";
import useTrackedInput from "../../helpers/useTrackedInput";
import { isUserRequiredError } from "../../helpers/UserRequiredError";
import GotoLogin from "../../components/GotoLogin";

import cs from "./styles.module.css";
import ProfileLayout from "../../components/ProfileLayout";
import LoadingMessage from "../../components/LoadingMessage";

const ProfilePage = () => {
  const name = useTrackedInput();
  const login = useTrackedInput();
  const password = useTrackedInput();

  const {
    data: userData,
    error: userError,
    isError: isUserError,
    isLoading,
  } = useGetUserQuery();

  useEffect(() => {
    name.setInitVal(userData?.name ?? "");
    login.setInitVal(userData?.email ?? "");
    password.setInitVal("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const [updateUser, updateResult] = useUpdateUserMutation();
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {};
    if (login.isChanged()) {
      data.email = login.props.value;
    }
    if (password.isChanged()) {
      data.password = password.props.value;
    }
    if (name.isChanged()) {
      data.name = name.props.value;
    }
    updateUser(data);
  };
  const showButtons =
    !login.props.disabled || !name.props.disabled || !password.props.disabled;
  const handleClear = () => {
    login.reset();
    password.reset();
    name.reset();
  };

  let errorEl = null;
  if (updateResult.isError || isUserError) {
    const error = userError ?? updateResult.error;
    if (isUserRequiredError(error)) {
      return <GotoLogin />;
    }
    errorEl = (
      <p
        className={cx(
          "text text_type_main-small text_color_inactive mt-4",
          cs.error
        )}
      >
        {(error.error ?? error)?.toString()}
      </p>
    );
  }
  return (
    <ProfileLayout description="В этом разделе вы можете изменить свои персональные данные">
      <form
        action="#"
        method="post"
        className={cs.form}
        onSubmit={handleSubmit}
      >
        <Input
          {...name.props}
          type="text"
          required
          placeholder="Имя"
          name={"name"}
          size={"default"}
        />
        <Input
          {...login.props}
          type="email"
          required
          placeholder="Логин"
          name={"login"}
          size={"default"}
          extraClass="mt-6"
        />
        <Input
          {...password.props}
          value={password.props.disabled ? "*****" : password.props.value}
          type="password"
          required
          placeholder="Пароль"
          name={"password"}
          size={"default"}
          extraClass="mt-6"
        />
        {errorEl}
        <div className={cx(cs.buttons, !showButtons && cs.hidden)}>
          <Button
            htmlType="button"
            type="secondary"
            size="large"
            extraClass="mt-6"
            onClick={handleClear}
          >
            Отмена
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            extraClass="mt-6"
          >
            Сохранить
          </Button>
        </div>
        {isLoading ? <LoadingMessage /> : null}
      </form>
    </ProfileLayout>
  );
};

export default ProfilePage;
