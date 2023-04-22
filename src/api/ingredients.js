const config = {
  baseUrl: 'https://norma.nomoreparties.space/api/',
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
  return fetch(config.baseUrl + 'ingredients', {
    headers: config.headers,
  }).then(getJson);
};

export const sendOrder = (ingredients) => {
  return fetch(config.baseUrl + 'orders', {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({ ingredients })
  }).then(getJson);
};
