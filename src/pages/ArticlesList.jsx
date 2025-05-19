import React, { useState } from 'react';
import { Pagination, Spin, Alert } from 'antd';
import ArticlePreview from '../components/ArticlePreview';
import { useArticle } from '../hooks/useArticles.js';
import styles from '../styles/ArticlesList.module.scss';

function ArticlesList() {
  const ARTICLES_PER_PAGE = 5;
  const [page, setPage] = useState(1);

  const { articles, articlesCount, loading, error } = useArticle(
    page,
    ARTICLES_PER_PAGE,
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Alert message="Ошибка загрузки статей" type="error" />
      </div>
    );
  }

  const handlePageChange = (page) => {
    setPage(page);
  };

  return (
    <div className={styles.container}>
      {articles.map((article) => (
        <ArticlePreview key={article.slug} article={article} />
      ))}

      <Pagination
        current={page}
        pageSize={ARTICLES_PER_PAGE}
        total={articlesCount}
        onChange={handlePageChange}
        className={styles.pagination}
        showSizeChanger={false}
      />
    </div>
  );
}

export default ArticlesList;
