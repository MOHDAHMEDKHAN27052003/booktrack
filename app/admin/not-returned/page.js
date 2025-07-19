'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NotReturnedPage() {
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const router = useRouter();  

  useEffect(() => {
    const signedInUser = JSON.parse(localStorage.getItem('signedInUser'));

    if (!signedInUser || signedInUser.role !== 'admin') {
      router.push('/');
      return;
    };

    setUser(signedInUser);

    const notReturned = JSON.parse(localStorage.getItem('notReturned')) || [];
    const books = JSON.parse(localStorage.getItem('books')) || [];

    const detailed = notReturned.map((entry) => {
      const book = books.find((b) => b.id === entry.bookId);
      return {
        ...entry,
        title: book ? book.title : 'Unknown Title',
      };
    });

    setEntries(detailed);
  }, []);

  const visibleEntries = entries.slice(0, visibleCount);
  const hasMore = visibleCount < entries.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div className='flex justify-center'>
      <div className='py-8'>
        <h2 className='text-2xl md:text-4xl'>Not Returned Books</h2>
        {entries.length === 0 ? (
          <p>No book due 😄</p>
        ) : (
          <div className='py-6 md:py-8'>
            <ul className='flex flex-col gap-4'>
              {visibleEntries.map((entry, idx) => (
                <li key={idx}>
                  📚 <strong>{entry.title}</strong> (ID: {entry.bookId}) <br />
                  👤 Issued by: {entry.userEmail} <br />
                  ⏱️ Marked at: {new Date(entry.timestamp).toLocaleTimeString()}
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasMore ? (
          <button onClick={handleLoadMore}>Load More</button>
        ) : (
          <p className='text-xl text-center'>You've reached the end of the list.</p>
        )}
      </div>
    </div>
  );
};