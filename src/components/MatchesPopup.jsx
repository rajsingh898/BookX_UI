import "./MatchesPopup.css";
import { bookService } from "../services/bookService";
import { useEffect, useState } from "react";

function MatchesPopup({ matches, onClose }) {

  const [userNames, setUserNames] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [connected, setConnected] = useState({});
  const [sending, setSending] = useState({});


  //   Fetch current logged-in user (name + email)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await bookService.getCurrentUser();
        setCurrentUser(res.data); 
        // expected: { name, email }
      } catch (err) {
        console.error("Error fetching current user", err);
      }
    };

    fetchCurrentUser();
  }, []);

  //   Fetch usernames for matched users
  useEffect(() => {
    const fetchUserNames = async () => {
      let namesMap = {};

      for (let offer of matches) {
        try {
          const res = await bookService.getUserInfo(offer.otherUserId);
          const fullName = Object.values(res.data)[0];
          namesMap[offer.otherUserId] = fullName;
        } catch (err) {
          console.error("Error fetching username:", err);
        }
      }

      setUserNames(namesMap);
    };

    if (matches.length > 0) {
      fetchUserNames();
    }
  }, [matches]);


const handleSendEmail = async (offer) => {

  //  Prevent double click
  if (sending[offer.otherUserId]) return;

  try {
    // mark as sending
    setSending(prev => ({
      ...prev,
      [offer.otherUserId]: true
    }));

    const res = await bookService.getUserInfo(offer.otherUserId);

    const otherUserEmail = Object.keys(res.data)[0];
    const otherUserName = Object.values(res.data)[0];

    await bookService.sendMail({
      myName: currentUser.fullName,
      myEmail: currentUser.email,

      otherUserName,
      otherUserEmail,

      myBook: offer.myBook,
      theirBook: offer.theirBook,
      theirBookCondition: offer.theirBookCondition,
    });

    //   success
    setConnected(prev => ({
      ...prev,
      [offer.otherUserId]: true
    }));

    alert("🤝 You’re now connected!");

  } catch (err) {
    console.error("Error sending mail", err);
    alert("❌ Failed to connect.");

  } finally {
    // ⏳ stop loading (only if not connected)
    setSending(prev => ({
      ...prev,
      [offer.otherUserId]: false
    }));
  }
};





  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>📌 Exchange Matches</h2>

        <button className="close-btn" onClick={onClose}>
          ✖ Close
        </button>

        {matches.length === 0 ? (
          <p>No matches found 😢</p>
        ) : (
          <div className="matches-list">
            {matches.map((offer, index) => (
              <div key={index} className="match-card">

                <div className="match-info">
                  <h3>
                    👤 {userNames[offer.otherUserId] || "Loading name..."}
                  </h3>

                  <hr />

                  <p><strong>Their Book:</strong> {offer.theirBook.title}</p>
                  <p><strong>Author:</strong> {offer.theirBook.author}</p>
                  <p><strong>Their Condition:</strong> {offer.theirBookCondition}</p>

                  <hr />

                  <p><strong>They Want Your Book:</strong> {offer.myBook.title}</p>
                  <p><strong>Author:</strong> {offer.myBook.author}</p>
                </div>

                  <button
  className="email-btn"
  disabled={connected[offer.otherUserId] || sending[offer.otherUserId]}
  aria-disabled={connected[offer.otherUserId] || sending[offer.otherUserId]}
  onClick={() => handleSendEmail(offer)}
>
  {connected[offer.otherUserId]
    ? "  Connected"
    : sending[offer.otherUserId]
      ? "⏳ Connecting..."
      : "🤝 Connect"}
</button>


              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MatchesPopup;
