'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { findEmail } from '@/lib/auth';
import Link from 'next/link';

export default function SignIn() {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();

  const onSubmit = (data) => {
    const email = findEmail(data.email);

    if (!email) {
      toast.error('Email does not exist!');
      return;
    };

    if (email.password !== data.password) {
      toast.error('Incorrect password!');
      return;
    };

    localStorage.setItem('signedInUser', JSON.stringify(email));
    reset();
    toast.success(`Welcome back, ${email.name}!`);
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
        <h2 className='text-4xl pb-4'>Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit, onError)}>

          <div className='pb-4'>
            <label className='text-xl'>Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className='w-full bg-white text-black outline-0 p-2 rounded-lg'
            />
          </div>

          <div className='pb-4'>
            <label className='text-xl'>Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className='w-full bg-white text-black outline-0 p-2 rounded-lg'
            />
          </div>

          <div className='py-8'>
            <button
              className='px-4 py-2 rounded-lg bg-white text-green-600 w-full cursor-pointer'
            >
              Sign In
            </button>
          </div>

          <div className='flex items-center justify-center'>
            <small>Don't have an account?</small>
            <Link
              href={"/signup"}
              className='underline'
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};