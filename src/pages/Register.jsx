import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Form.module.scss';

const schema = yup.object().shape({
  username: yup.string().min(3).max(20).required('Username is required'),
  email: yup
    .string()
    .email('Email must be valid')
    .required('Email is required'),
  password: yup.string().min(6).max(40).required('Password is required'),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  agree: yup
    .bool()
    .oneOf([true], 'You must agree to the processing of personal data'),
});

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  const onSubmit = async (data) => {
    const userData = {
      user: {
        username: data.username,
        email: data.email,
        password: data.password,
      },
    };

    try {
      const response = await fetch(
        'https://blog-platform.kata.academy/api/users',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        },
      );

      const resData = await response.json();

      if (response.ok) {
        navigate('/sign-in');
      } else {
        Object.entries(resData.errors || {}).forEach(([key, value]) => {
          const message = Array.isArray(value)
            ? value.join(', ')
            : String(value);
          setError(key, { type: 'server', message });
        });
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2>Create new account</h2>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          placeholder="Username"
          {...register('username')}
          className={styles.input}
        />
        {errors.username && (
          <p className={styles.error}>{errors.username.message}</p>
        )}

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          placeholder="Email address"
          {...register('email')}
          className={styles.input}
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          {...register('password')}
          className={styles.input}
        />
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}

        <label htmlFor="repeatPassword">Repeat Password</label>
        <input
          id="repeatPassword"
          type="password"
          placeholder="Repeat Password"
          {...register('repeatPassword')}
          className={styles.input}
        />
        {errors.repeatPassword && (
          <p className={styles.error}>{errors.repeatPassword.message}</p>
        )}

        <label className={styles.checkboxLabel}>
          <input type="checkbox" {...register('agree')} />I agree to the
          processing of my personal information
        </label>
        {errors.agree && <p className={styles.error}>{errors.agree.message}</p>}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={!isValid}
        >
          Create
        </button>

        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Already have an account? <a href="/sign-in">Sign In.</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
