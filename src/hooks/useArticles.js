import { useState, useEffect } from 'react';
import { fetchArticles } from '../api/articles';

export function useArticle(page, limit) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articlesCount, setArticlesCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchArticles(page, limit)
      .then((data) => {
        setArticles(data.articles);
        setLoading(false);
        setArticlesCount(data.articlesCount);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page, limit]);

  return { articles, setArticles, loading, error, articlesCount };
}
