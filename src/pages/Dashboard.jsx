import { useEffect, useState } from "react";
import { bookService } from "../services/bookService";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chatbot states
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // -------------------------------
  // Load dashboard user + stats
  // -------------------------------
  useEffect(() => {
    Promise.all([
      bookService.getCurrentUser(),
      bookService.getDashboardStats(),
    ])
      .then(([userRes, statsRes]) => {
        setUser(userRes.data);
        setStats(statsRes.data);
      })
      .catch((err) => {
        console.error("Failed to load dashboard", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // -------------------------------
  // Restore chat from localStorage
  // -------------------------------
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    const savedLoading = localStorage.getItem("chatLoading");

    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed);

      // If bot was still typing, continue request
      const lastMsg = parsed[parsed.length - 1];
      if (lastMsg?.text === "typing") {
        const lastQuestion = localStorage.getItem("lastQuestion");
        if (lastQuestion) {
          fetchBotResponse(lastQuestion);
        }
      }
    }

    if (savedLoading === "true") {
      setChatLoading(true);
    }
  }, []);

  // -------------------------------
  // Save loading state always
  // -------------------------------
  useEffect(() => {
    localStorage.setItem("chatLoading", chatLoading);
  }, [chatLoading]);

  // -------------------------------
  // Function to fetch bot response
  // -------------------------------
  const fetchBotResponse = async (questionText) => {
    setChatLoading(true);

    try {
      const res = await bookService.askChatbot(questionText);

      setMessages((prev) => {
        const updated = [...prev];

        // Replace typing placeholder
        updated[updated.length - 1] = {
          sender: "bot",
          text: res.data,
        };

        localStorage.setItem("chatMessages", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("Chatbot error:", err);

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "bot",
          text: "❌ Failed to get response",
        };

        localStorage.setItem("chatMessages", JSON.stringify(updated));
        return updated;
      });
    } finally {
      setChatLoading(false);
      localStorage.setItem("chatLoading", "false");
    }
  };

  // -------------------------------
  // Send message handler
  // -------------------------------
  const handleSend = () => {
    if (!question.trim()) return;

    const userMessage = {
      sender: "user",
      text: question,
    };

    const botPlaceholder = {
      sender: "bot",
      text: "typing",
    };

    // Save messages immediately
    setMessages((prev) => {
      const updated = [...prev, userMessage, botPlaceholder];
      localStorage.setItem("chatMessages", JSON.stringify(updated));
      return updated;
    });

    // Save last asked question
    localStorage.setItem("lastQuestion", question);

    // Clear input
    setQuestion("");

    // Fetch bot response
    fetchBotResponse(question);
  };

  // -------------------------------
  // Loading UI
  // -------------------------------
  if (loading) return <p>Loading dashboard...</p>;
  if (!user || !stats) return <p>Failed to load dashboard</p>;

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="avatar">{user.fullName.charAt(0)}</div>
          <h1>{user.fullName}</h1>
        </div>

        <div className="header-right">
          <span className="email">{user.email}</span>
          <span className="role">{user.role}</span>
        </div>
      </header>

      {/* Library Overview */}
      <section className="library">
        <div className="metric">
          <span>Owned</span>
          <strong>{stats.owned}</strong>
        </div>
        <div className="metric">
          <span>Read</span>
          <strong>{stats.read}</strong>
        </div>
        <div className="metric">
          <span>Unread</span>
          <strong>{stats.unread}</strong>
        </div>
        <div className="metric">
          <span>Wanted</span>
          <strong>{stats.wanted}</strong>
        </div>
      </section>

      {/* Chatbot Section */}
      <section className="chatbot">
        <h2>📜🤖BookX Assistant</h2>

        {/* Chat Window */}
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.text === "typing" ? (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                msg.text
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask something about books..."
            value={question}
            disabled={chatLoading}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !chatLoading) {
                handleSend();
              }
            }}
          />

          <button onClick={handleSend} disabled={chatLoading}>
            {chatLoading ? "..." : "Send"}
          </button>
        </div>
      </section>
      <p className="chat-disclaimer">
  📌 BookX Assistant may make mistakes. Please ask only book-related questions.
</p>

    </div>
    
  );
}

export default Dashboard;
