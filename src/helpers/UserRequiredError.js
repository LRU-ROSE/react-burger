export const createUserRequiredError = () => {
  return { name: "UserRequired" };
};

export const isUserRequiredError = (obj) => {
  return obj?.name === "UserRequired";
};
