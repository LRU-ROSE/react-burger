import { combineClasses } from "../../utils";
import cs from "./styles.module.css";

const NotFoundPage = () => {
  return (
    <h2 className={combineClasses("text text_type_main-medium", cs.text)}>
      Страница не найдена
    </h2>
  );
};

export default NotFoundPage;
