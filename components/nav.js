'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('signedInUser'));
    setUser(storedUser);
  }, []);

  // Utility to check if link is active
  const linkClass = (href) => {
    const isActive = pathname === href;
    return `${isActive ? 'bg-blue-600 text-white' : ''}`;
  };

  return (
    <nav
    >
      <Link href="/">
        📚 BOOKTRACK
      </Link>

      <div>
        {user?.role === 'admin' && (
          <>
            <Link href="/admin/issued" className={linkClass('/admin/issued')}>
              Issued Books
            </Link>
            <Link href="/books/create" className={linkClass("/books/create")}>
              Create Book
            </Link>
            <Link href="/profile" className={linkClass("/profile")}>
              Profile
            </Link>
          </>
        )}

        {user?.role === 'user' && (
          <>
            <Link href="/" className={linkClass('/')}>
              Home
            </Link>
            <Link href="/books/issued" className={linkClass("/books/issued")}>
              Issued Books
            </Link>
            <Link href="/profile" className={linkClass("/profile")}>
              Profile
            </Link>
          </>
        )}

        {!user && (
          <>
            <Link href="/" className={linkClass('/')}>
              Home
            </Link>
            <Link href="/signin" className={linkClass("/signin")}>
              SignIn
            </Link>
            <Link href="/signup" className={linkClass("/signup")}>
              SignUp
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};