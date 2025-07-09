'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

    const allIssued = JSON.parse(localStorage.getItem('issuedBooks')) || [];
    const allBooks = JSON.parse(localStorage.getItem('books')) || [];

    const userIssued = allIssued.filter((entry) => entry.userEmail === signedInUser.email);
      
    const detailed = userIssued.map((entry) => {
      const book = allBooks.find((b) => b.id === entry.bookId);
        
      return book
        ? {
            ...book,
            issuedAt: entry.issuedAt,
          }
        : null;
    }).filter(Boolean);

    setIssuedBooks(detailed);
    setBooks(allBooks);
  }, [router]);

  return (
    <div>
      <h2>Your Issued Books</h2>

      {issuedBooks.length === 0 ? (
        <p>You have not issued any books.</p>
      ) : (
        <div>
          {issuedBooks.map((book) => (
            <div
              key={book.id}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};