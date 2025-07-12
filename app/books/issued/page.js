'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

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
    <div>
      <h2>Your Issued Books</h2>

      {issuedBooks.length === 0 ? (
        <p>You have not issued any books.</p>
      ) : (
        <div>
          {issuedBooks.map((book) => (
            <div
              key={book.bookId}
            >
              <img
                src={book.image}
                alt={book.title}
              />
              <h4>{book.title}</h4>
              <p>{book.author}</p>
              <p>
                Issued on: {new Date(book.issuedAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleReturn(book.bookId)}
              >
                Return Book
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};