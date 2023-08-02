import { useParams } from "react-router-dom";
import { cx } from "../../utils";
import cs from "./styles.module.css";
import IngredientDetails from "../../components/IngredientDetails";
import { useGetIngredientsQuery } from "../../services/api/ingredientsApi";
import LoadingMessage from "../../components/LoadingMessage";
import ErrorMessage from "../../components/ErrorMessage";

const IngredientsPage = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetIngredientsQuery();
  let content;
  if (isLoading) {
    content = <LoadingMessage />;
  } else if (error) {
    content = <ErrorMessage error={error} />;
  } else {
    const elData = id && data?.byId[id];
    if (elData) {
      content = <IngredientDetails data={elData} />;
    } else {
      content = (
        <p className={cx("text text_type_main-medium mt-6", cs.error)}>
          Ошибка: ингредиент не найден
        </p>
      );
    }
  }
  return (
    <div className={cs.container}>
      <h2 className="text text_type_main-large">Детали ингредиента</h2>
      {content}
    </div>
  );
};

export default IngredientsPage;
