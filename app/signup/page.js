'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { findEmail, saveUser } from '@/lib/auth';
import Link from 'next/link';

export default function SignUpPage() {
  const { register, handleSubmit, reset } = useForm();
  const [role, setRole] = useState('user'); // default role
  const router = useRouter();

  const onSubmit = (data) => {
    if (findEmail(data.email)) {
      toast.error('Email already exists!');
      return;
    };

    const userData = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      role,
    };

    saveUser(userData);
    localStorage.setItem('signedInUser', JSON.stringify(userData));
    reset();
    toast.success(`Welcome, ${data.name}`);
    router.push("/profile");
  };

  const onError = (errors) => {
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  };

  return (
    <div className='flex justify-center px-4 py-12 sm:py-20'>
      <div className='px-6 py-12 rounded-2xl bg-green-600 text-white'>
        <h2 className='text-4xl pb-4'>Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit, onError)}>

          <div className='pb-4'>
            <label className='text-xl'>Name :</label>
            <input {...register('name', {
              required: 'Name is required',
              minLength: { value: 3, message: 'Name must be at least 3 characters' },
              maxLength: { value: 30, message: 'Name cannot exceed 30 characters' }
            })}
              className='w-full bg-white text-black outline-0 p-2 rounded-lg'
            />
          </div>

          <div className='pb-4'>
            <label className='text-xl'>Email :</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className='w-full bg-white text-black outline-0 p-2 rounded-lg'
            />
          </div>

          <div className='pb-4'>
            <label className='text-xl'>Password :</label>
            <input type="password" {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
              maxLength: { value: 12, message: 'Password cannot exceed 12 characters' }
            })}
              className='w-full bg-white text-black outline-0 p-2 rounded-lg'
            />
          </div>

          <div className='flex items-center justify-between pb-4'>
            <label className='text-xl'>Role :</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className='p-2 bg-white text-green-600 rounded-sm'
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className='px-4 py-2 rounded-lg bg-white text-green-600 w-full cursor-pointer'>Sign Up</button>

          <div className='flex items-center justify-center py-4'>
            <small>Already have an account?</small>
            <Link
              href={"/signin"}
              className='underline'
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};