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
    <div>
      <h2>SignUp</h2>
      <form onSubmit={handleSubmit(onSubmit, onError)}>

        <div>
          <label>Name</label>
          <input {...register('name', {
            required: 'Name is required',
            minLength: { value: 3, message: 'Name must be at least 3 characters' },
            maxLength: { value: 30, message: 'Name cannot exceed 30 characters' }
          })} />
        </div>

        <div>
          <label>Email</label>
          <input type="email" {...register('email', { required: 'Email is required' })} />
        </div>

        <div>
          <label>Password</label>
          <input type="password" {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
            maxLength: { value: 12, message: 'Password cannot exceed 12 characters' }
          })} />
        </div>

        <div>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button>SignUp</button>

        <div>
          <small>Already have an account?</small>
          <Link href={"/signin"}>SignIn</Link>
        </div>
      </form>
    </div>
  );
};