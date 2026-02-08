import { useEffect, useMemo, useState } from "react";
import { bookService } from "../services/bookService";
import MyBookCard from "../components/MyBookCard";
import "./AllBooks.css";

function MyBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");

  useEffect(() => {
    bookService.getMyBooks().then(res => setBooks(res.data));
  }, []);

  /* -----------------------------
     Genres
  ------------------------------*/
  const genres = useMemo(() => {
    return ["All", ...new Set(books.map(b => b.genre).filter(Boolean))];
  }, [books]);

  /* -----------------------------
     Filtering
  ------------------------------*/
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesGenre =
        activeGenre === "All" || book.genre === activeGenre;

      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author?.toLowerCase().includes(search.toLowerCase());

      return matchesGenre && matchesSearch;
    });
  }, [books, search, activeGenre]);

  /* -----------------------------
     UI-only handlers
  ------------------------------*/
 const handleUpdate = async (bookId, updates) => {
  const previousBooks = structuredClone(books);

  // optimistic update (instant UI feedback)
  setBooks(prev =>
    prev.map(b =>
      b.id === bookId ? { ...b, ...updates } : b
    )
  );

  try {
    const res = await bookService.updateOwnedBook(bookId, updates);

    // authoritative backend response
    setBooks(prev =>
      prev.map(b =>
        b.id === bookId ? res.data : b
      )
    );
  } catch (err) {
    console.error("Failed to update book", err);
    setBooks(previousBooks); // rollback
  }
};




   
  const handleRemove = async (bookId) => {
   
  const previousBooks = books;
  setBooks(prev => prev.filter(b => b.id !== bookId));

  try {
    await bookService.removeFromOwned(bookId);
  } catch (err) {
    console.error("Failed to remove my book", err);

    // rollback UI if backend fails
    setBooks(previousBooks);
    alert("Failed to remove my book. Please try again.");
  }
};

  return (
    <div className="page">
      <div className="books-container">

        {/* 🔍 Toolbar */}
        <div className="books-toolbar">
          <div className="filters-left">
            <span className="filters-label">Genres</span>
            <div className="genre-filters">
              {genres.map(genre => (
                <button
                  key={genre}
                  className={`genre-btn ${
                    activeGenre === genre ? "active" : ""
                  }`}
                  onClick={() => setActiveGenre(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="filters-right">
            <input
              type="text"
              className="book-search"
              placeholder="Search by title or author..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/*  Grid */}
        {filteredBooks.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "40px" }}>
            No books match your filters 📭
          </p>
        ) : (
          <div className="grid">
            {filteredBooks.map(book => (
              <MyBookCard
                key={book.id}
                book={book}
                onUpdate={handleUpdate}
                onRemove={  handleRemove }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBooks;
