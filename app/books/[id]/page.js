'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function BookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState('');
  const [user, setUser] = useState(null);

  const handleIssue = () => {
    const issuedBooks = JSON.parse(localStorage.getItem('issuedBooks')) || [];

    const alreadyIssued = issuedBooks.find(
      (entry) => entry.bookId === book.id && entry.userEmail === user.email
    );

    if (alreadyIssued) {
      toast.error('Book already issued!');
      return;
    };

    const userIssuedCount = issuedBooks.filter(
      (entry) => entry.userEmail === user.email
    ).length;

    if (userIssuedCount >= 3) {
      toast.error("You've reached the limit!");
      return;
    };

    const newEntry = {
      bookId: book.id,
      userEmail: user.email,
      issuedAt: new Date().toISOString(),
    };

    localStorage.setItem('issuedBooks', JSON.stringify([...issuedBooks, newEntry]));
    toast.success('Book issued successfully!');
    router.push("/books/issued");

    setTimeout(() => {
      const currentIssued = JSON.parse(localStorage.getItem('issuedBooks')) || [];

      const stillIssued = currentIssued.find(
        (entry) => entry.bookId === book.id && entry.userEmail === user.email
      );

      if (stillIssued) {
        const notReturned = JSON.parse(localStorage.getItem('notReturned')) || [];
        const alreadyMarked = notReturned.find(
          (entry) => entry.bookId === book.id && entry.userEmail === user.email
        );

        if (!alreadyMarked) {
          notReturned.push({
            bookId: book.id,
            userEmail: user.email,
            timestamp: new Date().toISOString(),
          });
          localStorage.setItem('notReturned', JSON.stringify(notReturned));
        };
      };
    }, 10000);
  };

  const handleDelete = () => {
    const confirm = window.confirm('Confirm delete!');

    if (!confirm) return;

    const books = JSON.parse(localStorage.getItem('books')) || [];
    const updatedBooks = books.filter((b) => b.id.toString() !== id);

    localStorage.setItem('books', JSON.stringify(updatedBooks));

    toast.error('Book deleted successfully!', {
      autoClose: 1500,
      onClose: () => router.push('/')
    });
  };

  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
    const foundBook = storedBooks.find((b) => b.id.toString() === id);
      
    if (!foundBook) {
      router.push('/');
      return;
    };

    setBook(foundBook);

    const signedInUser = JSON.parse(localStorage.getItem('signedInUser'));
    setUser(signedInUser);
  }, [id, router]);

  return (
    <div className='py-16'>
      <div className='flex flex-col lg:flex-row justify-center gap-12 lg:gap-28 items-center'>
        <Image
          src={book.image}
          alt={book.title}
          height={0}
          width={0}
          className='h-40 w-72 lg:h-60 lg:w-1/3 rounded-2xl'  
        />
        <div className='p-6 sm:px-8 lg:px-24 rounded-2xl bg-green-400 text-white'>
          <h2 className='text-2xl py-2 font-medium'>{book.title}</h2>
          <p><strong>ID:</strong> {book.id}</p>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Description:</strong> {book.description}</p>
          {user?.role === 'admin' && (
            <div className='flex justify-center gap-12 py-6'>
              <Link
                href={`/books/${book.id}/edit`}
                className='bg-yellow-400 text-white px-6 py-2 rounded-lg'  
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className='bg-red-600 text-white cursor-pointer px-6 py-2 rounded-lg'
              >
                Delete
              </button>
            </div>
          )}
          {user?.role === 'user' && (
            <div  className='text-center py-8'>
              <button
                onClick={handleIssue}
                className='bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer'
              >
                Issue Book
              </button>
            </div>
          )}
          {!user && (
            <div className='text-center py-8'>
              <Link
                href={"/signin"}
                className='bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer' 
              >
                Issue Book
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};