'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('signedInUser'));
    setUser(storedUser);
  }, []);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Utility to check if link is active
  const linkClass = (href) => {
    const isActive = pathname === href;
    return `${isActive ? 'text-blue-600' : ''}`;
  };

  return (
    <>
      <nav className='flex items-center justify-around p-4'>
        <Link href="/" className='text-2xl font-extralight'>
          📚 BOOKTRACK
        </Link>

        <button
          onClick={toggleMenu}
          className="md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:flex bg-black text-white px-24 py-4 rounded-lg">
          {user?.role === 'admin' && (
            <div className='flex gap-16'>
              <Link href="/admin/issued" className={linkClass('/admin/issued')}>
                Issued Books
              </Link>
              <Link href="/books/create" className={linkClass("/books/create")}>
                Create Book
              </Link>
              <Link href="/profile" className={linkClass("/profile")}>
                Profile
              </Link>
            </div>
          )}

          {user?.role === 'user' && (
            <div className='flex gap-16'>
              <Link href="/" className={linkClass('/')}>
                Home
              </Link>
              <Link href="/books/issued" className={linkClass("/books/issued")}>
                Issued Books
              </Link>
              <Link href="/profile" className={linkClass("/profile")}>
                Profile
              </Link>
            </div>
          )}

          {!user && (
            <div className='flex gap-16'>
              <Link href="/" className={linkClass('/')}>
                Home
              </Link>
              <Link href="/signin" className={linkClass("/signin")}>
                Sign In
              </Link>
              <Link href="/signup" className={linkClass("/signup")}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
      <div className={`md:hidden transition-all duration-300 ease-in-out transform overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'
        } px-4 sm:px-16`}>
        <div className="flex flex-col gap-4 py-8 items-center rounded-2xl bg-black text-white">
          {user?.role === 'admin' && (
            <>
              <Link href="/admin/issued" className={linkClass('/admin/issued')}>
                Issued Books
              </Link>
              <Link href="/books/create" className={linkClass('/books/create')}>
                Create Book
              </Link>
              <Link href="/profile" className={linkClass('/profile')}>
                Profile
              </Link>
            </>
          )}

          {user?.role === 'user' && (
            <>
              <Link href="/" className={linkClass('/')}>
                Home
              </Link>
              <Link href="/books/issued" className={linkClass('/books/issued')}>
                Issued Books
              </Link>
              <Link href="/profile" className={linkClass('/profile')}>
                Profile
              </Link>
            </>
          )}

          {!user && (
            <>
              <Link href="/" className={linkClass('/')}>
                Home
              </Link>
              <Link href="/signin" className={linkClass('/signin')}>
                Sign In
              </Link>
              <Link href="/signup" className={linkClass('/signup')}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};