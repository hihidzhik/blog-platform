import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import styles from '../styles/Form.module.scss';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup
    .string()
    .email('Email must be valid')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(40, 'Password must be at most 40 characters')
    .required('New password is required'),
  image: yup
    .string()
    .url('Avatar must be a valid URL')
    .required('Avatar image is required'),
});

function EditProfile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      image: user?.image || '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    const updatedUser = {
      user: {
        username: data.username,
        email: data.email,
        password: data.password,
        image: data.image,
      },
    };

    try {
      const response = await fetch(
        'https://blog-platform.kata.academy/api/user',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(updatedUser),
        },
      );

      const resData = await response.json();

      if (response.ok) {
        login(resData.user);
        localStorage.setItem('token', resData.user.token);
        navigate('/');
      } else {
        Object.entries(resData.errors || {}).forEach(([key, value]) => {
          const message = Array.isArray(value)
            ? value.join(', ')
            : String(value);
          setError(key, { type: 'server', message });
        });
      }
    } catch (error) {
      setError('email', {
        type: 'manual',
        message: 'Network error. Please try again.',
      });
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2>Edit Profile</h2>

        <label>Username</label>
        <input
          {...register('username')}
          placeholder="Username"
          className={styles.input}
        />
        {errors.username && (
          <p className={styles.error}>{errors.username.message}</p>
        )}

        <label>Email address</label>
        <input
          {...register('email')}
          placeholder="Email address"
          className={styles.input}
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

        <label>New password</label>
        <input
          type="password"
          {...register('password')}
          placeholder="New password"
          className={styles.input}
        />
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}

        <label>Avatar image (url)</label>
        <input
          {...register('image')}
          placeholder="Avatar image URL"
          className={styles.input}
        />
        {errors.image && <p className={styles.error}>{errors.image.message}</p>}

        <button type="submit" className={styles.submitButton}>
          Save
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
