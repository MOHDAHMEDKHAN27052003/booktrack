'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [genres, setGenres] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const router = useRouter();

  useEffect(() => {
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
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div>
      <h2>All Books</h2>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(5); // Reset on search
          }}
        />

        <select
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
            setVisibleCount(5); // Reset on genre change
          }}
        >
          {genres.map((g, i) => (
            <option key={i} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {visibleBooks.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div>
          {visibleBooks.map((book) => (
            <div
              key={book.id}
              onClick={()=>{router.push(`/books/${book.id}`)}}
            >
              <img
                src={book.image}
                alt={book.title}
              />
              <h4>{book.title}</h4>
              <p>{book.author}</p>
              <p>{book.genre}</p>
            </div>
          ))}
            
          {hasMore ? (
            <button onClick={handleLoadMore}>Load More</button>
          ) : (
            <p>You've reached the end of the list!</p>
          )}
        </div>
      )}
    </div>
  );
};