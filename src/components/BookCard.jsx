import "./BookCard.css";

function BookCard({
  book,
  owned,
  wanted,
  onAddOwned,
  onAddWanted,
  onRemoveWanted
}) {
  return (
    <div className="book-card">

      {/* Title */}
      <h3>{book.title}</h3>
      <p className="author">{book.author}</p>

      {/* Status badge */}
      {owned && <span className="status read">Owned</span>}
      {!owned && wanted && <span className="status unread">Wanted</span>}

      {/* Genre */}
      <span className="genre">{book.genre}</span>

      {/*  Description (RESTORED) */}
      {book.description && (
        <p className="desc">{book.description}</p>
      )}

      {/* Actions */}
      <div className="actions">

        {/* ALL BOOKS – new book */}
        {!onRemoveWanted && !owned && !wanted && (
          <>
            <button onClick={onAddOwned}>Add to My Books</button>
            <button className="secondary" onClick={onAddWanted}>
              Add to Wanted
            </button>
          </>
        )}

        {/* ALL BOOKS – owned */}
        {!onRemoveWanted && owned && (
          <button className="disabled" disabled>
            In My Books
          </button>
        )}

        {/* ALL BOOKS – wanted */}
        {!onRemoveWanted && wanted && (
          <button className="disabled secondary" disabled>
            In Wanted
          </button>
        )}

        {/* WANTED BOOKS – ONLY remove */}
        {onRemoveWanted && (
          <button className="secondary" onClick={onRemoveWanted}>
            Remove from Wanted
          </button>
        )}

      </div>
    </div>
  );
}

export default BookCard;
