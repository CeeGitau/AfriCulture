import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./components/Loader";
import Landing from "./pages/landing";
import Register from "./pages/register";
import Login from "./pages/login";
import Homepage from "./pages/homepage";
import About from "./pages/about";
import Profile from "./pages/profile";
import EditProfile from "./pages/EditProfile";
import Logout from "./pages/logout";
import AddPost from "./pages/AddPost";
import EditPost from "./pages/EditPost";
import Posts from "./pages/Posts";
import SinglePost from "./pages/SinglePost";
import CategoryPosts from "./pages/CategoryPosts";
import SingleCategoryPost from "./pages/SingleCategoryPost";
import UserContext from "./contexts/UserContext";

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/register', element: <Register /> },
  { path: '/login', element: <Login /> },
  { path: '/homepage', element: <Homepage /> },
  { path: '/about', element: <About /> },
  { path: '/profile', element: <Profile /> },
  { path: '/edit-profile', element: <EditProfile /> },
  { path: '/logout', element: <Logout /> },
  { path: '/add-post', element: <AddPost /> },
  { path: '/edit-post/:id', element: <EditPost /> },
  { path: '/all-posts', element: <Posts /> },
  { path: '/single-post/:postId', element: <SinglePost /> },
  { path: '/category/:categoryName', element: <CategoryPosts />},
  { path: '/single-category-post/:categoryName/post/:postId', element: <SingleCategoryPost /> },
]);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }

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
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }
        })
        .catch(err => {
          console.error("Auth check failed:", err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <Loader />;

  return (
      <UserContext.Provider value={{ user, setUser }}>
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={3000} />
      </UserContext.Provider>
  );
}

export default App;
