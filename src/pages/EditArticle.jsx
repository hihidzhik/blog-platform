import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/Form.module.scss';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  body: yup.string().required('Text is required'),
});

function EditArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  useEffect(() => {
    const fetchArticle = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(
          `https://blog-platform.kata.academy/api/articles/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        reset({
          title: data.article.title,
          description: data.article.description,
          body: data.article.body,
        });
        setTags(data.article.tagList || []);
      } catch (err) {
        console.error('Error fetching article:', err);
      }
    };

    fetchArticle();
  }, [slug, reset]);

  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTag('');
    }
  };

  const handleDeleteTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    const updatedArticle = {
      article: {
        ...data,
        tagList: tags,
      },
    };

    try {
      const res = await fetch(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(updatedArticle),
        },
      );

      const resData = await res.json();

      if (!res.ok) {
        Object.entries(resData.errors || {}).forEach(([key, value]) => {
          const message = Array.isArray(value)
            ? value.join(', ')
            : String(value);
          setError(key, { type: 'server', message });
        });
        return;
      }

      navigate(`/articles/${resData.article.slug}`);
    } catch (err) {
      console.error('Network error:', err);
    }
  };

  return (
    <div className={styles.formContainerNewArticle}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2>Edit article</h2>

        <label htmlFor="title">Title</label>
        <input
          id="title"
          {...register('title')}
          className={styles.input}
          placeholder="Title"
        />
        {errors.title && <p className={styles.error}>{errors.title.message}</p>}

        <label htmlFor="description">Short description</label>
        <input
          id="description"
          {...register('description')}
          className={styles.input}
          placeholder="Description"
        />
        {errors.description && (
          <p className={styles.error}>{errors.description.message}</p>
        )}

        <label htmlFor="body">Text</label>
        <textarea
          id="body"
          {...register('body')}
          className={styles.bigInput}
          placeholder="Text"
        />
        {errors.body && <p className={styles.error}>{errors.body.message}</p>}

        <div className={styles.tagContainer}>
          <label>Tags</label>

          <div className={styles.tags}>
            {tags.map((tag, index) => (
              <div key={index} className={styles.tagRow}>
                <input
                  type="text"
                  value={tag}
                  readOnly
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteTag(index)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className={styles.tagRow}>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Tag"
              className={styles.input}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className={styles.addTag}
            >
              Add tag
            </button>
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          Send
        </button>
      </form>
    </div>
  );
}

export default EditArticle;
