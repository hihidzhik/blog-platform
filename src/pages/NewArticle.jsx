import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Form.module.scss';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  body: yup.string().required('Text is required'),
});

function NewArticle() {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const navigate = useNavigate();
  const [tagError, setTagError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  const handleAddTag = () => {
    const trimmed = newTag.trim();

    if (!trimmed) {
      setTagError('Поле тега не может быть пустым');
      return;
    }

    if (tags.includes(trimmed)) {
      setTagError('Этот тег уже добавлен');
      return;
    }

    setTags([...tags, trimmed]);
    setNewTag('');
    setTagError('');
  };

  const handleDeleteTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    const newArticle = {
      article: {
        ...data,
        tagList: tags,
      },
    };

    try {
      const res = await fetch('https://blog-platform.kata.academy/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newArticle),
      });

      const result = await res.json();

      if (!res.ok) {
        Object.entries(result.errors || {}).forEach(([key, value]) => {
          const message = Array.isArray(value) ? value.join(', ') : String(value);
          setError(key, { type: 'server', message });
        });
        return;
      }

      navigate(`/articles/${result.article.slug}`);
    } catch (err) {
      console.error('Network error:', err);
    }
  };

  return (
    <div className={styles.formContainerNewArticle}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2>Create new article</h2>

        <label htmlFor="title">Title</label>
        <input id="title" {...register('title')} className={styles.input} placeholder="Title" />
        {errors.title && <p className={styles.error}>{errors.title.message}</p>}

        <label htmlFor="description">Short description</label>
        <input
          id="description"
          {...register('description')}
          className={styles.input}
          placeholder="Description"
        />
        {errors.description && <p className={styles.error}>{errors.description.message}</p>}

        <label htmlFor="body">Text</label>
        <textarea id="body" {...register('body')} className={styles.bigInput} placeholder="Text" />
        {errors.body && <p className={styles.error}>{errors.body.message}</p>}

        <div className={styles.tagContainer}>
          <label htmlFor="tags">Tags</label>
          <div className={styles.tags}>
            {tags.map((tag, index) => (
              <div key={index} className={styles.tagRow}>
                <input type="text" value={tag} readOnly className={styles.input} />
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
              onChange={(e) => {
                setNewTag(e.target.value);
                setTagError('');
              }}
              placeholder="Tag"
              className={styles.input}
            />
            <button type="button" onClick={handleAddTag} className={styles.addTag}>
              Add tag
            </button>
          </div>
          {tagError && <p className={styles.error}>{tagError}</p>}
        </div>

        <button type="submit" className={styles.submitButton}>
          Send
        </button>
      </form>
    </div>
  );
}

export default NewArticle;
