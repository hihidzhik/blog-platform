import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import styles from '../styles/Form.module.scss';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Email must be valid')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  const onSubmit = async (data) => {
    const loginData = {
      user: {
        email: data.email,
        password: data.password,
      },
    };

    try {
      const response = await fetch(
        'https://blog-platform.kata.academy/api/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        },
      );

      const resData = await response.json();

      if (response.ok) {
        login(resData.user);
        localStorage.setItem('token', resData.user.token);
        navigate('/');
      } else {
        for (const key in resData.errors) {
          const value = resData.errors[key];
          const message = Array.isArray(value)
            ? value.join(', ')
            : String(value);
          setError(key, { type: 'server', message });
        }
      }
    } catch (err) {
      setError('email', {
        type: 'manual',
        message: 'Network error. Please try again.',
      });
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2>Sign In</h2>

        <label>Email address</label>
        <input
          type="email"
          placeholder="Email address"
          {...register('email')}
          className={styles.input}
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          {...register('password')}
          className={styles.input}
        />
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}

        <button type="submit" className={styles.submitButton}>
          Login
        </button>

        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Don’t have an account? <a href="/sign-up">Sign Up.</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
