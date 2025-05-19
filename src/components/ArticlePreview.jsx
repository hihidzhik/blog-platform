import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useAuth } from '../store/authContext';
import ArticleMeta from './ArticleMeta';
import styles from '../styles/ArticlePreview.module.scss';

function ArticlePreview({ article }) {
  const [isFavorited, setIsFavorited] = useState(article.favorited);
  const [favoritesCount, setFavoritesCount] = useState(article.favoritesCount);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLikeClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      toast.error('Пожалуйста, войдите в систему, чтобы оценить статью');
      navigate('/sign-in');
      return;
    }

    try {
      const method = isFavorited ? 'DELETE' : 'POST';
      const res = await fetch(
        `https://blog-platform.kata.academy/api/articles/${article.slug}/favorite`,
        {
          method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );

      if (res.ok) {
        setIsFavorited(!isFavorited);
        setFavoritesCount((prev) => prev + (isFavorited ? -1 : 1));
      } else {
        toast.error('Ошибка при обновлении лайка');
      }
    } catch {
      toast.error('Ошибка при обновлении лайка');
    }
  };

  return (
    <div className={styles.articlePreview}>
      <Link to={`/articles/${article.slug}`} className={styles.articleLink}>
        <div>
          <div className={styles.title}>
            <h2 className={styles.title}>{article.title}</h2>
            <div
              className={styles.likes}
              onClick={handleLikeClick}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              {isFavorited ? (
                <HeartFilled style={{ color: 'red' }} />
              ) : (
                <HeartOutlined />
              )}
            </div>
            <span className={styles.likes}>{favoritesCount}</span>
          </div>
          <div className={styles.tags}>
            {article.tagList.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          <p className={styles.description}>{article.description}</p>
        </div>
        <div className={styles.info}>
          <ArticleMeta author={article.author} createdAt={article.createdAt} />
        </div>
      </Link>
    </div>
  );
}

export default ArticlePreview;
