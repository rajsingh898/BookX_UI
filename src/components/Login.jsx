import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";
import "./AuthLayout.css";

function Login() {
  const { setIsLoggedIn, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  //  PAGE LOADER
  const [pageLoading, setPageLoading] = useState(true);

  //  FORM STATE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  //  Show loader whenever user VISITS login page
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
      return;
    }

    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("https://api-gateway-0xes.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
  let message = "Login failed";

  try {
    const err = await response.json();

    if (response.status === 401) {
      message = "Invalid email or password";
    } else if (response.status >= 500) {
      message = "Server is unavailable. Please try again later.";
    } else {
      message = err.message || message;
    }
  } catch {
    if (response.status >= 500) {
      message = "Server is unavailable. Please try again later.";
    }
  }

  throw new Error(message);
}

      const data = await response.json();

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("email", email);

      setIsLoggedIn(true);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  // PAGE LOADER FIRST
  if (pageLoading) {
    return <Loader />;
  }

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>📚 BookX</h1>
        <p>
          BookX is a book sharing community where readers can browse books,
          add their own collection, and exchange books with others.
        </p>
      </div>

      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          {error && <p style={{ color: "crimson" }}>{error}</p>}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>

          <div className="auth-footer">
            Don’t have an account? <a href="/register">Register</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
