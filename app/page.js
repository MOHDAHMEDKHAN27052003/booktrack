'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [genres, setGenres] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('signedInUser'));
    setUser(storedUser);

    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
    setBooks(storedBooks);

    const uniqueGenres = ['All', ...new Set(storedBooks.map((book) => book.genre))];
    setGenres(uniqueGenres);
  }, []);

  const filteredBooks = books.filter((book) => {
    const keyword = search.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword);
    const matchesGenre = genre === 'All' || book.genre === genre;

    return matchesSearch && matchesGenre;
  });

  const visibleBooks = filteredBooks.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBooks.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div>
      {user?.role === 'admin' && (
        <div className="bg-yellow-200 border-l-4 border-yellow-600 p-4 rounded">
          <p className="text-sm text-center text-gray-800">
            Some users may have not returned their books on time.{' '}
            <Link
              href="/admin/not-returned"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Check it out!
            </Link>
          </p>
        </div>
      )}
      <div className='px-16 py-4 sm:px-24'>
      <div className='flex flex-col sm:flex-row items-center gap-4 pt-8 pb-12'>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(6); // Reset on search
          }}
          className='px-4 py-2 rounded-lg bg-green-400 text-white outline-0'
        />

        <select
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
            setVisibleCount(6); // Reset on genre change
          }}
          className='p-2 rounded-lg bg-green-400 text-white outline-0'
        >
          {genres.map((g, i) => (
            <option
              key={i}
              value={g}
            >
              {g}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setSearch('');
            setGenre('All');
            setVisibleCount(6);
          }}
          className='bg-red-600 text-white px-6 py-2 rounded-lg cursor-pointer'
        >
          Reset
        </button>  
      </div>

      {visibleBooks.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16'>
          {visibleBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => { router.push(`/books/${book.id}`) }}
              className='flex flex-col items-center gap-2 py-16 lg:py-20 bg-gray-800 text-white rounded-2xl'
            >
              <Image
                src={book.image}
                alt={book.title}
                height={0}
                width={0}
                className='rounded-xl h-28 w-48'
              />
              <h4>{book.title}</h4>
              <p>{book.author}</p>
              <p>{book.genre}</p>
            </div>
          ))}
        </div>
      )}
      {hasMore ? (   
        <div className='flex justify-center py-16'>
          <button
            onClick={handleLoadMore}
            className='bg-green-400 text-white px-4 py-2 rounded-lg cursor-pointer'
          >
            Load More
          </button>
        </div>
        ) : (
        <p className='text-center py-8 text-lg'>You've reached the end of the list!</p>
      )}
      </div>
    </div>
  );
};