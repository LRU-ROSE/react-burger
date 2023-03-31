const config = {
  url: 'https://norma.nomoreparties.space/api/ingredients',
  headers: {
    'Content-Type': 'application/json',
  },
};

const getJson = (res) => {
  if (res.ok) {
    return res.json();
  }

  return Promise.reject(new Error(`Ошибка (${res.status}): ${res.statusText}`));
};

export const getIngredients = () => {
  return fetch(config.url, {
    headers: config.headers,
  }).then(getJson);
};
