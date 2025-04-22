import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/landing";
import Register from "./pages/register";
import Login from "./pages/login";
import Homepage from "./pages/homepage";
import About from "./pages/about";
import Profile from "./pages/profile";
import Logout from "./pages/logout";
import UserContext from "./contexts/UserContext";

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/register', element: <Register /> },
  { path: '/login', element: <Login />},
  { path: '/homepage', element: <Homepage />},
  { path: '/about', element: <About />},
  { path: '/profile', element: <Profile />},
  { path: '/logout', element: <Logout />},
]);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:5000/api/auth", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.user);
          } else {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }
        })
        .catch(err => {
          console.error("Auth check failed:", err);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        });
    } else if (storedUser) {
      // fallback — likely outdated but still useful as a last resort
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
}

export default App;
