import { Route, Routes, Navigate } from 'react-router-dom';
import ArticlesList from '../pages/ArticlesList';
import Article from '../pages/Article';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NewArticle from '../pages/NewArticle';
import EditArticle from '../pages/EditArticle';
import EditProfile from '../pages/EditProfile';
import { useAuth } from '../store/authContext';

function AppRouter() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<ArticlesList />} />
      <Route path="/articles/:slug" element={<Article />} />
      <Route path="/sign-in" element={user ? <Navigate to="/" /> : <Login />} />
      <Route
        path="/sign-up"
        element={user ? <Navigate to="/sign-in" /> : <Register />}
      />
      <Route
        path="/profile"
        element={user ? <EditProfile /> : <Navigate to="/sign-in" />}
      />
      <Route
        path="/new-article"
        element={user ? <NewArticle /> : <Navigate to="/sign-in" />}
      />
      <Route
        path="/articles/:slug/edit"
        element={user ? <EditArticle /> : <Navigate to="/sign-in" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRouter;
