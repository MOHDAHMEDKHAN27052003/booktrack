'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [books, setBooks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
    setBooks(storedBooks);
  }, []);

  if (books.length === 0) {
    return <p>No books available!</p>;
  };

  return (
    <div>
      <h2>All Books</h2>
      <div>
        {books.map((book) => (
          <div
            key={book.id}
            onClick={() => router.push(`/books/${book.id}`)}
          >
            {book.image && (
              <img
                src={book.image}
                alt={book.title}
              />
            )}
            <h4>{book.title}</h4>
            <p><strong>Author:</strong> {book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};