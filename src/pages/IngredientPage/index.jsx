import { useParams } from "react-router-dom";
import { combineClasses } from "../../utils";
import cs from "./styles.module.css";
import IngredientDetails from "../../components/IngredientDetails";
import { useGetIngredientsQuery } from "../../services/api/ingredientsApi";

const IngredientsPage = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetIngredientsQuery();
  let content;
  if (isLoading) {
    content = <p className="text text_type_main-medium mt-6">Загрузка...</p>;
  } else if (error) {
    content = (
      <p
        className={combineClasses("text text_type_main-medium mt-6", cs.error)}
      >{`Ошибка: ${error}`}</p>
    );
  } else {
    const elData = data?.byId[id];
    if (elData) {
      content = <IngredientDetails data={elData} />;
    } else {
      content = (
        <p
          className={combineClasses(
            "text text_type_main-medium mt-6",
            cs.error
          )}
        >Ошибка: ингредиент не найден</p>
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
