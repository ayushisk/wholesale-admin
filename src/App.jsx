"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Routes from "./routes/routes.jsx";
import { checkAuthStatus } from "./features/actions/authAction.js";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check auth status on app start
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RouterProvider router={Routes} />
    </>
  );
}

export default App;
