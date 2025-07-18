'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [book, setBook] = useState(null);
  const [preview, setPreview] = useState('');
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
      setPreview(reader.result);
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
    setPreview('');
  };

  const onError = (errors) => {
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  };

  return (
    <div className='flex justify-center px-6 py-12 sm:py-16'>
      <div className='px-6 sm:px-12 py-12 sm:py-16 rounded-2xl bg-green-600 text-white'>
      <h2 className='text-4xl pb-4'>Edit Book</h2>
      <form onSubmit={handleSubmit(onSubmit,onError)}>
        <div className='pb-4'>
          <label className='text-xl'>Image :</label>
          <input type="file" accept="image/*" onChange={handleImageUpload}  className='w-full text-xl' />
          <input type="hidden" {...register('image', { required: 'Image is required' })} />
          {preview && (
            <div className='flex justify-center py-4'>
              <Image
                src={preview}
                alt="Book Preview"
                height={0}
                width={0}  
                className='rounded-2xl h-32 w-64'
              />
            </div>
          )}  
        </div>
              
        <div className='pb-4'>
          <label className='text-xl'>Title :</label>
          <input {...register('title', {
            required: 'Title is required',
            minLength: { value: 3, message: 'Title must be at least 3 characters' },
            maxLength: { value: 30, message: 'Title can\'t exceed 30 characters' }
          })}
            className='w-full bg-white text-black outline-0 p-2 rounded-lg'
          />
        </div>

        <div className='pb-4'>
          <label className='text-xl'>Author :</label>
          <input {...register('author', {
            required: 'Author is required',
            minLength: { value: 3, message: 'Name must be at least 3 characters' },
            maxLength: { value: 30, message: 'Name can\'t exceed 30 characters' }
          })}
            className='w-full bg-white text-black outline-0 p-2 rounded-lg'
          />
        </div>

        <div className='flex justify-between items-center pb-4'>
          <label className='text-xl'>Genre :</label>
          <select
            {...register('genre', { required: 'Genre is required' })}
            className='p-2 bg-white text-green-600 rounded-sm'
          >
            <option value="">Select Genre</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-fiction">Non-fiction</option>
            <option value="Mystery">Mystery</option>
            <option value="Science">Science</option>
            <option value="Biography">Biography</option>
          </select>
        </div>

        <div className='pb-4'>
          <label className='text-xl'>Description :</label>
          <textarea rows="4" {...register('description', {
            required: 'Description is required',
            minLength: { value: 15, message: 'Description must be at least 15 characters' },
            maxLength: { value: 150, message: 'Description can\'t exceed 150 characters' }
          })}
            className='w-full bg-white text-black outline-0 p-2 rounded-lg'
          ></textarea>
        </div>
        <div className='py-8 text-right'>
          <button
            className='px-4 py-2 rounded-lg bg-white text-green-600 cursor-pointer'
          >
            Update
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};