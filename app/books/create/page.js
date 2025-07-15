'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function CreateBookPage() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('signedInUser'));

    if (!storedUser) {
      router.push('/signin');
      return;
    };

    if (storedUser.role !== 'admin') {
      router.push('/profile');
      return;
    };

    setUser(storedUser);
  }, [router]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setValue('image', reader.result, { shouldValidate: true });
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data) => {
    const existingBooks = JSON.parse(localStorage.getItem('books')) || [];

    const newBook = {
      id: Date.now(),
      image: data.image,
      title: data.title,
      author: data.author,
      genre: data.genre,
      description: data.description,
      createdBy: user.name,
    };

    localStorage.setItem('books', JSON.stringify([...existingBooks, newBook]));
    toast.success('Book created successfully!');
    reset();
    setPreview('');
    router.push('/');
  };

  const onError = (errors) => {
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  };
    
  return (
    <div>
      <h2>Create a Book</h2>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div>
          <label>Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <input type="hidden" {...register('image', { required: 'Image is required' })} />

          {preview && (
            <img
              src={preview}
              alt="Book Preview"
            />
          )}
        </div>
        <div>
          <label>Title</label>
          <input {...register('title', {
            required: 'Title is required',
            minLength: { value: 3, message: 'Title must be at least 3 characters' },
            maxLength: { value: 30, message: 'Title can\'t exceed 30 characters' }
          })} />
        </div>

        <div>
          <label>Author</label>
          <input {...register('author', {
            required: 'Author is required',
            minLength: { value: 3, message: 'Name must be at least 3 characters' },
            maxLength: { value: 30, message: 'Name can\'t exceed 30 characters' }
          })} />
        </div>

        <div>
          <label>Genre</label>
          <select {...register('genre', { required: 'Genre is required' })}>
            <option value="">Select Genre</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-fiction">Non-fiction</option>
            <option value="Mystery">Mystery</option>
            <option value="Science">Science</option>
            <option value="Biography">Biography</option>
          </select>
        </div>

        <div>
          <label>Description</label>
          <textarea
            rows="4"
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 15, message: 'Description must be at least 15 characters' },
              maxLength: { value: 150, message: 'Description can\'t exceed 150 characters' }
            })}
          ></textarea>
        </div>

        <button>Create Book</button>
      </form>
    </div>
  );
};