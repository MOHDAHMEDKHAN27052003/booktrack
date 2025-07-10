'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIssuedBooksPage() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [booksMap, setBooksMap] = useState({});
  const router = useRouter();

  useEffect(() => {
    const signedInUser = JSON.parse(localStorage.getItem('signedInUser'));

    if (!signedInUser || signedInUser.role !== 'admin') {
      router.push('/');
      return;
    };

    setUser(signedInUser);

    const issued = JSON.parse(localStorage.getItem('issuedBooks')) || [];
    const books = JSON.parse(localStorage.getItem('books')) || [];

    const bookLookup = {};
      
    books.forEach((book) => {
      bookLookup[book.id] = book;
    });

    setBooksMap(bookLookup);
    setIssuedBooks(issued);
  }, [router]);

  return (
    <div>
      <h2>All Issued Books</h2>

      {issuedBooks.length === 0 ? (
        <p>No books have been issued yet.</p>
      ) : (
        <div>
          {issuedBooks.map((entry, index) => {
            const book = booksMap[entry.bookId];

            if (!book) return null;

            return (
              <div key={index}>
                <img
                  src={book.image}
                  alt={book.title}
                />
                <h4>{book.title}</h4>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Issued by:</strong> {entry.userEmail}</p>
                <p>
                  Issued on: {new Date(entry.issuedAt).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};