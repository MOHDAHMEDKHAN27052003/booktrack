'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const [user, setUser] = useState('');
  const router = useRouter();
    
  const SignOut = () => {
    const confirm = window.confirm("Confirm Sign Out");  
      
    if (!confirm) {
      return;
    };

    localStorage.removeItem('signedInUser');
    router.push('/signin');
    toast.error("You're Signed Out!");
  };

  useEffect(() => {
    const signedInUser = localStorage.getItem('signedInUser');
      
    if (!signedInUser) {
      router.push('/signin');
      return;
    };
      
    setUser(JSON.parse(signedInUser));
  }, [router]);

  return (
    <div className='flex justify-around items-center py-12'>
      <div>
        <h2 className='text-4xl font-medium py-6'>Your profile :-</h2>
        <p className='pb-2'><strong>Name:</strong> {user.name}</p>
        <p className='pb-2'><strong>ID:</strong> {user.id}</p>    
        <p className='pb-2'><strong>Email:</strong> {user.email}</p>
        <p className='pb-2'><strong>Role:</strong> {user.role}</p>
        <div className='py-4'>
          <button
            onClick={SignOut}
            className='bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer'
          >
            Sign Out
          </button>
        </div>
      </div>
      <Image
        src="/images/hello.webp"
        alt='Hello'
        width={400}
        height={300}
        className='hidden sm:block rounded-2xl'
      />
    </div>
  );
};