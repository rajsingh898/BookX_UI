import { useState } from "react";
import "./AddBookModal.css";

function AddBookModal({ book, onClose, onSubmit }) {
  const [condition, setCondition] = useState("GOOD");
  const [readStatus, setReadStatus] = useState("UNREAD");
  const [exchangeReady, setExchangeReady] = useState(true);

  const handleSubmit = () => {
     console.log("MODAL SUBMIT", {
    condition,
    readStatus,
    exchangeReady
  });
    onSubmit({
      condition,
      readStatus,
      exchangeReady
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Add “{book.title}”</h2>

        {/* Condition */}
        <label>
          Condition
          <select value={condition} onChange={e => setCondition(e.target.value)}>
            <option value="NEW">New</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
            <option value="POOR">Poor</option>
          </select>
        </label>

        {/* Read Status */}
        <label>
          Read Status
          <select value={readStatus} onChange={e => setReadStatus(e.target.value)}>
            <option value="UNREAD">Unread</option>
            <option value="READING">Reading</option>
            <option value="READ">Read</option>
          </select>
        </label>

        {/* Exchange Ready */}
        <label className="checkbox">
          <input
            type="checkbox"
            checked={exchangeReady}
            onChange={e => setExchangeReady(e.target.checked)}
          />
          Available for exchange
        </label>

        <div className="modal-actions">
          <button className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button onClick={handleSubmit}>
            Add Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddBookModal;
