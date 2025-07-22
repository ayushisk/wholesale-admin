import { createBrowserRouter } from "react-router-dom";

import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import Dashboard from "../pages/Dashboard/Dashboard";

import Login from "../pages/Login/Login";
import Layout from "../components/Layout/Layout";
import ProtectedRoute from "../components/Layout/ProtectedRoute";
import ListCategory from "../pages/Category/ListCategory";
import AddCategory from "../pages/Category/AddCategory";
import ListUser from "../pages/Users/ListUser";
import ListProduct from "../pages/Product/ListProduct";
import AddProduct from "../pages/Product/AddProduct";
import ListOrders from "../pages/Order/ListOrders";

const Routes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/category",
        element: <ListCategory />,
      },
      {
        path: "/category/add-category",
        element: <AddCategory />,
      },
      {
        path: "/products",
        element: <ListProduct />,
      },
      {
        path: "/products/add-product",
        element: <AddProduct />,
      },
      {
        path: "/order",
        element: <ListOrders />,
      },
      {
        path: "/user",
        element: <ListUser />,
      },
    ],
  },
]);

export default Routes;
