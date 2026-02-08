import "./BookCard.css";

function ExchangeBookCard({ book, onLookMatches }) {
  return (
    <div className="book-card">

      {/* Book Info */}
      <h3>{book.title}</h3>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Genre:</strong> {book.genre}</p>
      <p><strong>Condition:</strong> {book.condition}</p>

      {/* Only One Button */}
      <button
        className="match-btn"
        onClick={() => onLookMatches(book.id)}
      >
        Look Matches 🔍
      </button>
    </div>
  );
}

export default ExchangeBookCard;
