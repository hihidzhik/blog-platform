import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Modal } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useAuth } from '../store/authContext';
import ArticleMeta from '../components/ArticleMeta';
import styles from '../styles/ArticlePreview.module.scss';

function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `https://blog-platform.kata.academy/api/articles/${slug}`,
        );
        const data = await response.json();
        setArticle(data.article);
      } catch (err) {
        setError('Ошибка загрузки статьи');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: 'Are you sure to delete this article?',
      okText: 'Yes',
      cancelText: 'No',
      okType: 'danger',
      centered: true,
      onOk: async () => {
        try {
          const res = await fetch(
            `https://blog-platform.kata.academy/api/articles/${slug}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            },
          );

          if (res.ok) {
            navigate('/');
          } else {
            Modal.error({ title: 'Не удалось удалить статью' });
          }
        } catch (err) {
          Modal.error({ title: 'Произошла ошибка при удалении' });
        }
      },
    });
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!article) return <p>Статья не найдена</p>;

  const isAuthor = user && user.username === article.author.username;

  return (
    <div className={styles.card}>
      <ArticleMeta author={article.author} createdAt={article.createdAt} />
      <div className={styles.titleBox}>
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.likesWrapper}>
          {article.favorited ? (
            <HeartFilled style={{ color: 'red' }} />
          ) : (
            <HeartOutlined />
          )}
          <span>{article.favoritesCount}</span>
        </div>
      </div>
      <div className={styles.tags}>
        {article.tagList.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
      <p className={styles.description}>{article.description}</p>
      <ReactMarkdown>{article.body}</ReactMarkdown>
      {isAuthor && (
        <div className={styles.controls}>
          <button onClick={showDeleteConfirm} className={styles.deleteButton}>
            Delete
          </button>
          <Link to={`/articles/${slug}/edit`}>
            <button className={styles.editButton}>Edit</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Article;
