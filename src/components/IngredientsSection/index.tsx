import { cx } from "../../utils";
import IngredientEl from "../Ingredient";

import cs from "./styles.module.css";
import { Ingredient } from "../../types/Ingredient";

type Props = {
  name: string;
  className?: string;
  index: number;
  ingredients: Ingredient[];
};

const IngredientsSection = ({ name, className, index, ingredients }: Props) => {
  const ingredientsEls = ingredients.map((item) => (
    <IngredientEl data={item} key={item._id} />
  ));
  return (
    <div className={cx(cs.section, className)} data-index={index}>
      <h2 className={`text text_type_main-medium mb-6 ${cs.header}`}>{name}</h2>
      {ingredientsEls}
    </div>
  );
};

export default IngredientsSection;
