import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("You have been logged out.");
    logout();
    navigate("/login");
  };


  return (
    <header className="navbar">
      <h2 className="logo">📚 BookX</h2>

      <nav className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/books">Book Store</Link>
        <Link to="/my-books">My Books</Link>
        <Link to="/wanted-books">Wanted</Link>
        <Link to="/exchange">Exchange</Link>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}

export default Navbar;
