import { useEffect, useMemo, useState } from "react";
import { bookService } from "../services/bookService";
import ExchangeBookCard from "../components/ExchangeBookCard";
import "./AllBooks.css";
import MatchesPopup from "../components/MatchesPopup";

function ExchangeBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [matches, setMatches] = useState([]);
const [popupOpen, setPopupOpen] = useState(false);
const [loadingMatches, setLoadingMatches] = useState(false);


  /* -----------------------------
     Fetch Exchange Books
  ------------------------------*/
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
     Match Button Handler
  ------------------------------*/
  const handleLookMatches = async (bookId) => {
  console.log("Looking matches for book:", bookId);

  setLoadingMatches(true);
  setPopupOpen(true);

  try {
    const res = await bookService.getExchangeMatches(bookId);
    setMatches(res.data);
  } catch (err) {
    console.error("Error fetching matches:", err);
    setMatches([]);
  }

  setLoadingMatches(false);
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
            No books match your filters 📭
          </p>
        ) : (
          <div className="grid">
            {filteredBooks.map(book => (
              <ExchangeBookCard
                key={book.id}
                book={book}
                onLookMatches={handleLookMatches}
              />
            ))}
          </div>
        )}
        {popupOpen && (
  <MatchesPopup
    matches={matches}
    onClose={() => setPopupOpen(false)}
  />
)}

      </div>
    </div>
  );
}

export default ExchangeBooks;
