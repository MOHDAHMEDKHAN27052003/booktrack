'use client';

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
    <div>
      <h2>Profile Page</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>ID:</strong> {user.id}</p>    
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <button onClick={SignOut}>Sign Out</button>
    </div>
  );
};