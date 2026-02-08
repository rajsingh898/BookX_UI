import { useEffect, useMemo, useState } from "react";
import { bookService } from "../services/bookService";
import BookCard from "../components/BookCard";
import AddBookModal from "../components/AddBookModal";
import "./AllBooks.css";


function AllBooks() {
  const [books, setBooks] = useState([]);
  const [ownedBooks, setOwnedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [wantedBooks, setWantedBooks] = useState([]);


  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");

  useEffect(() => {
    bookService.getAllBooks().then(res => setBooks(res.data));
    bookService.getMyBooks().then(res => setOwnedBooks(res.data));
    bookService.getWantedBooks().then(res => setWantedBooks(res.data));
  }, []);

  const ownedBookIds = new Set(
    ownedBooks.map(ob => ob.book?.id ?? ob.id)
  );
  const wantedBookIds = new Set(
  wantedBooks.map(wb => wb.book?.id ?? wb.id)
);

  const handleAddOwned = (book) => {
    setSelectedBook(book);
  };

  const handleModalSubmit = async (options) => {
    try {
      await bookService.addToMyBooks(selectedBook, options);
      setOwnedBooks(prev => [...prev, selectedBook]);
      setSelectedBook(null);
    } catch (error) {
      if (error.response?.status === 409) {
        alert("You already own this book");
      }
    }
  };
 const handleAddWanted = async (book) => {
  try {
    // optimistic UI update
    setWantedBooks(prev => [...prev, book]);

    await bookService.addToWanted(book);
  } catch (error) {
    // rollback UI on failure
    setWantedBooks(prev =>
      prev.filter(b =>
        !(b.title === book.title && b.author === book.author)
      )
    );

    if (error.response?.status === 409) {
      alert("Book already in wanted list");
    }
  }
};

 

  // Collect unique genres from books
  const genres = useMemo(() => {
    const allGenres = books.flatMap(b => b.genre || []);
    return ["All", ...new Set(allGenres)];
  }, [books]);

  // Filter books by genre + search
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesGenre =
        activeGenre === "All" ||
        book.genre?.includes(activeGenre);

      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author?.toLowerCase().includes(search.toLowerCase());

      return matchesGenre && matchesSearch;
    });
  }, [books, activeGenre, search]);

  return (
    <div className="page">
      <div className="books-container">

        {/*  Toolbar */}
        <div className="books-toolbar">

          {/* Left: Genres */}
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

          {/* Right: Search */}
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

        {/* Grid */}
        <div className="grid">
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              owned={ownedBookIds.has(book.id)}
              wanted={wantedBookIds.has(book.id)}
              onAddOwned={() => handleAddOwned(book)}
              onAddWanted={() => handleAddWanted(book)}
            />
          ))}
        </div>

        {/*  Modal */}
        {selectedBook && (
          <AddBookModal
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onSubmit={handleModalSubmit}
          />
        )}
      </div>
    </div>
  );
}

export default AllBooks;
