import { useState, useEffect} from "react";

function MyBookCard({ book, onUpdate, onRemove }) {
  const [readStatus, setReadStatus] = useState(book.readStatus);
  const [condition, setCondition] = useState(book.condition);
  const [exchangeReady, setExchangeReady] = useState(book.exchangeReady);

const handleUpdate = () => {
  onUpdate(book.id, {
    readStatus,
    condition,
    exchangeReady
  });
};
 
  useEffect(() => {
    setReadStatus(book.readStatus);
    setCondition(book.condition);
    setExchangeReady(book.exchangeReady);
  }, [book]);

  return (
    <div className="book-card">

      <h3>{book.title}</h3>
      <p className="author">{book.author}</p>

      <span className="genre">{book.genre}</span>

      {/* Read Status */}
      <div style={{ marginTop: "12px" }}>
        <label className="filters-label">Read Status</label>
        <select
          value={readStatus}
          onChange={e => setReadStatus(e.target.value)}
        >
          <option value="UNREAD">Unread</option>
          <option value="READ">Read</option>
          <option value="READING">READING</option>
        </select>
      </div>

      {/* Condition */}
      <div style={{ marginTop: "12px" }}>
        <label className="filters-label">Condition</label>
        <select
          value={condition}
          onChange={e => setCondition(e.target.value)}
        >
          <option value="NEW">New</option>
          <option value="GOOD">Good</option>
          <option value="FAIR">Fair</option>
          <option value="POOR">Poor</option>
        </select>
      </div>
      <div style={{ marginTop: "12px" }}>
  <label className="filters-label">Exchange Ready</label>
  <select
  value={String(exchangeReady)}
  onChange={e => setExchangeReady(e.target.value === "true")}
>
  <option value="false">No</option>
  <option value="true">Yes</option>
</select>

</div>


      {/* Actions */}
      <div className="actions" style={{ marginTop: "16px" }}>
        <button onClick={handleUpdate}>
          Update Details
        </button>

        <button
          className="secondary"
          onClick={() => onRemove(book.id)}
        >
          Remove from My Books
        </button>
      </div>

    </div>
  );
}

export default MyBookCard;
