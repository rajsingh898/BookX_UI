import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import "./AuthLayout.css";

function Register() {
  const navigate = useNavigate();

  // . PAGE LOADER
  const [pageLoading, setPageLoading] = useState(true);

  // . FORM STATE
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Password rules
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>/?]).{10,}$/;

  // . Show loader on page visit
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !fullName || !password) {
      setError("All fields are required");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 10 characters long and include 1 number and 1 special character"
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("https://api-gateway-0xes.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, password }),
      });

     if (!response.ok) {
  let message = "Registration failed";

  try {
    const err = await response.json();
    message = err.message || message;
  } catch {
    message = response.status >= 500
      ? "Server is unavailable. Please try again later."
      : message;
  }

  throw new Error(message);
}


      navigate("/login");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  // . PAGE LOADER FIRST
  if (pageLoading) {
    return <Loader />;
  }

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>📚 Join BookX</h1>
        <p>
          Create your account and start sharing your books with people who love reading.
        </p>

        <ul className="auth-features">
          <li>➕ Add your books</li>
          <li>🔁 Exchange with others</li>
          <li>📚 Grow your library</li>
        </ul>
      </div>

      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Register</h2>

          {error && <p style={{ color: "crimson" }}>{error}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create Account"}
          </button>

          <div className="auth-footer">
            Already have an account? <a href="/login">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
