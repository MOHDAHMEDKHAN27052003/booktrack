'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NotReturnedPage() {
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);  
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

  return (
    <div>
      <h2>Not Returned Books</h2>
      {entries.length === 0 ? (
        <p>No book due 😄</p>
      ) : (
        <ul>
          {entries.map((entry, idx) => (
            <li key={idx}>
              📚 <strong>{entry.title}</strong> (ID: {entry.bookId}) <br />
              👤 Issued by: {entry.userEmail} <br />
              ⏱️ Marked at: {new Date(entry.timestamp).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};