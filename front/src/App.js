import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/landing";

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
