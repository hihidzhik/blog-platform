import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import styles from '../styles/Header.module.scss';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <h1>
        <button onClick={() => navigate('/')}>Realworld Blog</button>
      </h1>

      {user ? (
        <div className={styles.userSection}>
          <button
            onClick={() => navigate('/new-article')}
            className={styles.createArticle}
          >
            Create article
          </button>
          <button
            onClick={() => navigate('/profile')}
            className={styles.userName}
          >
            {user.username}
            <img
              src={
                user.image ||
                'https://static.productionready.io/images/smiley-cyrus.jpg'
              }
              alt={user.username}
              className={styles.avatar}
            />
          </button>
          <button onClick={handleLogout} className={styles.logOut}>
            Log Out
          </button>
        </div>
      ) : (
        <div>
          <Link to="/sign-in">
            <button className={styles.signIn}>Sign In</button>
          </Link>
          <Link to="/sign-up">
            <button className={styles.signUp}>Sign Up</button>
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
