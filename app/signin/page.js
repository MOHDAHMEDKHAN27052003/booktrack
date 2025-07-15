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
    <div>
      <h2>SignIn</h2>
      <form onSubmit={handleSubmit(onSubmit, onError)}>

        <div>
          <label>Email</label>
          <input type="email" {...register('email', { required: 'Email is required' })} />
        </div>

        <div>
          <label>Password</label>
          <input type="password" {...register('password', { required: 'Password is required' })} />
        </div>

        <button>SignIn</button>

        <div>
          <small>Don't have an account?</small>
          <Link href={"/signup"}>SignUp</Link>
        </div>
      </form>
    </div>
  );
};