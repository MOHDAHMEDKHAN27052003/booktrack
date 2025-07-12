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
          toast.warn('You did not return this book in 10 seconds!');
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
            Edit
          </Link>
          <button onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
      {user?.role === 'user' && (
        <button
          onClick={handleIssue}
        >
          Issue Book
        </button>
      )}
      {!user && (
        <Link href={"/signin"}>
          Issue Book
        </Link>
      )}
    </div>
  );
};