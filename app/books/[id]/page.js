'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function BookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState('');
  const [user, setUser] = useState(null);

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
    <div>
      <h2>{book.title}</h2>
      <img
        src={book.image}
        alt={book.title}
      />
      <p><strong>ID:</strong> {book.id}</p>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Genre:</strong> {book.genre}</p>
      <p><strong>Description:</strong> {book.description}</p>
      <p><strong>Created By:</strong> {book.createdBy}</p>
      {user?.role === 'admin' && (
        <div>
          <Link href={`/books/${book.id}/edit`}>
            <button>Edit</button>
          </Link>
          <button onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};