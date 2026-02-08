import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./pages/Dashboard";
import AllBooks from "./pages/AllBooks";
import MyBooks from "./pages/MyBooks";
import WantedBooks from "./pages/WantedBooks";
import Exchange from "./pages/ExchangeBook";
import AuthLayout from "./components/AuthLayout";
import AppLayout from "./components/AppLayout";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isLoggedIn } = useAuth(); //  

  return (
    <Routes>
      {/* AUTH */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />
          }
        />
      </Route>

      {/* APP */}
      <Route
        element={
          isLoggedIn ? <AppLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books" element={<AllBooks />} />
        <Route path="/my-books" element={<MyBooks />} />
        <Route path="/wanted-books" element={<WantedBooks />} />
        <Route path="/exchange" element={<Exchange />} />
      </Route>

      {/* FALLBACK */}
      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}

export default App;
