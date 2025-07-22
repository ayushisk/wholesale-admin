import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBars,
  FaHome,
  FaUsers,
  FaBlog,
  FaEnvelope,
  FaFileAlt,
} from "react-icons/fa";
import { MdGroup, MdAddBox, MdArticle, MdAdd } from "react-icons/md";

import { useState } from "react";
import SidebarMenu from "./SidebarMenu";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    icon: <FaHome />,
  },

  {
    path: "/category",
    name: "Category",
    icon: <FaUsers />,
    subRoutes: [
      { path: "/category", name: "List category", icon: <MdGroup /> },
      {
        path: "/category/add-category",
        name: "Add Parent Category",
        icon: <MdAddBox />,
      },
    ],
  },
  {
    path: "/products",
    name: "Product",
    icon: <FaUsers />,
    subRoutes: [
      { path: "/products", name: "List product", icon: <MdGroup /> },
      {
        path: "/products/add-product",
        name: "Add product",
        icon: <MdAddBox />,
      },
    ],
  },
  {
    path: "/order",
    name: "Orders",
    icon: <FaUsers />,
    subRoutes: [{ path: "/order", name: "List Order", icon: <MdGroup /> }],
  },
  {
    path: "/user",
    name: "Users",
    icon: <FaUsers />,
    subRoutes: [
      { path: "/user", name: "List User", icon: <MdGroup /> },
      {
        path: "/user/add-user",
        name: "Add User",
        icon: <MdAddBox />,
      },
    ],
  },
];

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const showAnimation = {
    hidden: { width: 0, opacity: 0, transition: { duration: 0.2 } },
    show: { opacity: 1, width: "auto", transition: { duration: 0.3 } },
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <motion.div
        animate={{ width: isOpen ? "250px" : "60px" }}
        transition={{ duration: 0.4, ease: "easeInOut" }} // Smooth transition
        className="bg-gray-900 text-white flex flex-col shadow-lg"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          {isOpen && (
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="text-lg focus:outline-none hover:text-gray-300 text-white"
          >
            <FaBars />
          </button>
        </div>
        <nav className="flex-grow overflow-y-auto">
          {routes.map((route, index) => (
            <div key={index}>
              {route.subRoutes ? (
                <SidebarMenu
                  route={route}
                  isOpen={isOpen}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                  showAnimation={showAnimation}
                />
              ) : (
                <NavLink
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200 ${
                      isActive
                        ? "bg-gray-800 text-white border-r-2 border-blue-500"
                        : ""
                    }`
                  }
                >
                  <div className="mr-3">{route.icon}</div>
                  {isOpen && <span>{route.name}</span>}
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-700">
          {isOpen && (
            <div className="text-xs text-gray-400">
              <div>© 2023 Admin Panel</div>
              <div>v1.0</div>
            </div>
          )}
        </div>
      </motion.div>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default SideBar;
