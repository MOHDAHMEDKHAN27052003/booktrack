'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [book, setBook] = useState(null);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const signedInUser = JSON.parse(localStorage.getItem('signedInUser'));
      
    if (!signedInUser || signedInUser.role !== 'admin') {
        router.push('/');
        return;
    };
      
    setUser(signedInUser);

    const books = JSON.parse(localStorage.getItem('books')) || [];
    const found = books.find(b => b.id.toString() === id);
      
    if (!found) {
      toast.error('Book not found');
      router.push('/');
      return;
    };

    setBook(found);

    // Set form values
    setValue('title', found.title);
    setValue('author', found.author);
    setValue('genre', found.genre);
    setValue('description', found.description);
    setValue('image', found.image);
  }, [id, router, setValue]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
      
    if (!file) return;

    const reader = new FileReader();
      
    reader.onloadend = () => {
      setValue('image', reader.result, { shouldValidate: true });
    };
      
    reader.readAsDataURL(file);
  };

  const onSubmit = (data) => {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const updatedBooks = books.map((b) =>
      b.id.toString() === id ? { ...b, ...data } : b
    );

    localStorage.setItem('books', JSON.stringify(updatedBooks));
    toast.success('Book updated successfully!', {
      autoClose: 1500,
      onClose: () => router.push(`/books/${id}`)
    });
  };

  const onError = (errors) => {
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  };

  return (
    <div>
      <h2>Edit Book</h2>
      <form onSubmit={handleSubmit(onSubmit,onError)}>
        <div>
          <label>Change Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <input type="hidden" {...register('image', { required: 'Image is required' })} />
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
          <textarea rows="4" {...register('description', {
            required: 'Description is required',
            minLength: { value: 15, message: 'Description must be at least 15 characters' },
            maxLength: { value: 150, message: 'Description can\'t exceed 150 characters' }
          })}></textarea>
        </div>

        <button>Save Changes</button>
      </form>
    </div>
  );
};