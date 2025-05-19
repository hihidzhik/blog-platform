export const fetchArticles = async (page = 1, limit = 5) => {
  const offset = (page - 1) * limit;

  const token = localStorage.getItem('token');

  const res = await fetch(
    `https://blog-platform.kata.academy/api/articles?limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error('Ошибка загрузки статей');
  }
  return res.json();
};
