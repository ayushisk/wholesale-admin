/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from "framer-motion";
import { FaAngleDown } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const menuAnimation = {
  hidden: { opacity: 0, height: 0, padding: 0, transition: { duration: 0.3 } },
  show: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
};

const SidebarMenu = ({ route, isOpen, openMenu, setOpenMenu }) => {
  const isMenuOpen = openMenu === route.name; // Check if current menu is open

  const toggleMenu = () => {
    setOpenMenu(isMenuOpen ? null : route.name); // Close if already open, else open
  };

  return (
    <div>
      <button
        onClick={toggleMenu}
        className="flex items-center justify-between w-full px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
      >
        <div className="flex items-center">
          <div className="mr-3">{route.icon}</div>
          {isOpen && <span>{route.name}</span>}
        </div>
        {isOpen && (
          <motion.div
            animate={{ rotate: isMenuOpen ? -90 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-2"
          >
            <FaAngleDown />
          </motion.div>
        )}
      </button>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{
              hidden: {
                opacity: 0,
                height: 0,
                padding: 0,
                transition: { duration: 0.3 },
              },
              show: {
                opacity: 1,
                height: "auto",
                transition: { duration: 0.3 },
              },
            }}
            className="bg-gray-800"
          >
            {route.subRoutes.map((subRoute, index) => (
              <NavLink
                to={subRoute.path}
                key={index}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 pl-12 text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
                    isActive ? "bg-gray-700 text-white" : ""
                  }`
                }
              >
                {isOpen && <span>{subRoute.name}</span>}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarMenu;
