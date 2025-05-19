import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import Header from './components/Header';
import './styles/index.css';
import styles from './styles/App.module.scss';
import { AuthProvider } from './store/authContext';

function App() {
  return (
    <div className={styles.app}>
      <AuthProvider>
        <Router>
          <Header />
          <AppRouter />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
