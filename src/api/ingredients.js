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

  throw new Error(`Ошибка (${res.status}): ${res.statusText}`);
};

export const getIngredients = (abortSignal) => {
  return fetch(config.url, {
    headers: config.headers,
    signal: abortSignal,
  }).then(getJson);
};
