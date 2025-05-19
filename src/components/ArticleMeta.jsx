import { format } from 'date-fns';
import styles from '../styles/ArticlePreview.module.scss';

function ArticleMeta({ author, createdAt }) {
  const formattedDate = format(new Date(createdAt), 'MMMM dd, yyyy');

  return (
    <div className={styles.articleMeta}>
      <div className={styles.info}>
        <div className={styles.infoMeta}>
          <span className={styles.author}>{author.username}</span>
          <span className={styles.date}>{formattedDate}</span>
        </div>
        <img
          src={author.image || 'default-avatar.png'}
          alt={author.username}
          className={styles.avatar}
        />
      </div>
    </div>
  );
}

export default ArticleMeta;
