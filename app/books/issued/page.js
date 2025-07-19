'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function IssuedBooksPage() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const signedInUser = JSON.parse(localStorage.getItem('signedInUser'));

    if (!signedInUser || signedInUser.role !== 'user') {
      router.push('/');
      return;
    };

    setUser(signedInUser);
    loadIssuedBooks(signedInUser);
  }, [router]);

  const loadIssuedBooks = (user) => {
    const allIssued = JSON.parse(localStorage.getItem('issuedBooks')) || [];
    const allBooks = JSON.parse(localStorage.getItem('books')) || [];

    const userIssued = allIssued.filter((entry) => entry.userEmail === user.email);
    const detailed = userIssued
      .map((entry) => {
        const book = allBooks.find((b) => b.id === entry.bookId);
        return book
          ? {
              ...book,
              issuedAt: entry.issuedAt,
              bookId: entry.bookId, // so we can return using this
            }
          : null;
      })
      .filter(Boolean);

    setIssuedBooks(detailed);
    setBooks(allBooks);
  };

  const handleReturn = (bookId) => {
    const confirm = window.confirm("Confirm book return!");

    if (!confirm) {
      return;
    };

    const allIssued = JSON.parse(localStorage.getItem('issuedBooks')) || [];

    const updated = allIssued.filter(
      (entry) => !(entry.bookId === bookId && entry.userEmail === user.email)
    );

    localStorage.setItem('issuedBooks', JSON.stringify(updated));

    const notReturned = JSON.parse(localStorage.getItem('notReturned')) || [];
    const updatedNotReturned = notReturned.filter(
      (entry) => !(entry.bookId === bookId && entry.userEmail === user.email)
    );
    
    localStorage.setItem('notReturned', JSON.stringify(updatedNotReturned));

    toast.success('Book returned successfully!');
    loadIssuedBooks(user); // refresh list
  };

  return (
    <div className='flex justify-center py-8'>
      <div>
        <h2 className='text-2xl sm:text-4xl pb-8 md:pb-12 text-center'>Your Issued Books</h2>
        {issuedBooks.length === 0 ? (
          <p className='text-center'>You have not issued any books.</p>
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-12'>
            {issuedBooks.map((book) => (
              <div
                key={book.bookId}
                className='flex flex-col gap-2 bg-gray-800 text-white px-6 py-16 rounded-2xl text-center'
              >
                <Image
                  src={book.image}
                  alt={book.title}
                  height={0}
                  width={0}
                  className='h-40 w-60 rounded-2xl'
                />
                <h4 className='text-2xl'>{book.title}</h4>
                <p>{book.author}</p>
                <p>
                  Issued on: {new Date(book.issuedAt).toLocaleDateString()}
                </p>
                <div className='pt-4'>
                  <button
                    onClick={() => handleReturn(book.bookId)}
                    className='px-6 py-2 rounded-lg cursor-pointer bg-blue-600'
                  >
                    Return
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};