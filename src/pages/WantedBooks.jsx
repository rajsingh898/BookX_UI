import { useEffect, useMemo, useState } from "react";
import { bookService } from "../services/bookService";
import BookCard from "../components/BookCard";
import "./AllBooks.css";

function WantedBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");

  useEffect(() => {
    bookService.getWantedBooks().then(res => setBooks(res.data));
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
     UI-only actions (backend later)
  ------------------------------*/
 const handleRemoveWanted = async (bookId) => {
  // optimistic UI update
  const previousBooks = books;
  setBooks(prev => prev.filter(b => b.id !== bookId));

  try {
    await bookService.removeFromWanted(bookId);
  } catch (err) {
    console.error("Failed to remove wanted book", err);

    // rollback UI if backend fails
    setBooks(previousBooks);
    alert("Failed to remove wanted book. Please try again.");
  }
};


const handleAddOwned = (book) => {
  // later:
  // bookService.addToMyBooks(book);

  handleRemoveWanted(book.id);
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

        {/* 📚 Grid */}
        {filteredBooks.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "40px" }}>
            No wanted books yet ⭐
          </p>
        ) : (
          <div className="grid">
            {filteredBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                owned={false}
                wanted={true}
                onRemoveWanted={() => handleRemoveWanted(book.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WantedBooks;
