// import { useState, useEffect, useRef } from "react";
// import { HiOutlineChevronDown } from "react-icons/hi";
// import { IoPersonCircleOutline } from "react-icons/io5";
// // import { useDispatch } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";

// // import { adminLogout } from "../../../features/actions/authAction";
// // import { logout } from "../../../features/slices/authSlice";
// import logo from "../../../assets/logo.png";

// const Header = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   // const dispatch = useDispatch();

//   const navigate = useNavigate(); // Hook to programmatically navigate

//   const dropdownRef = useRef(null); // Reference for the dropdown
//   const buttonRef = useRef(null); // Reference for the button

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const handleLogout = async () => {
//     // dispatch(adminLogout());
//     // dispatch(logout());

//     // Clear the local storage
//     localStorage.removeItem("digitalAuth");
//     navigate("/login");

//     setIsDropdownOpen(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target) &&
//         buttonRef.current &&
//         !buttonRef.current.contains(event.target)
//       ) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <header className="bg-white text-black shadow-md border-b-4 border-[#0a1d3f]">
//       <div className="flex items-center justify-between px-6 py-2">
//         {/* Logo Section */}
//         <img src={logo} className="w-32 h-8" alt="Logo" />

//         {/* User Info Section */}
//         <div className="relative">
//           <button
//             ref={buttonRef} // Set ref to the button
//             onClick={toggleDropdown}
//             className="flex items-center space-x-2 text-base font-medium hover:text-[#3ebd59] focus:outline-none"
//           >
//             <IoPersonCircleOutline className="text-3xl" />
//             <span className="hidden sm:inline">{"Admin"}</span>
//             <HiOutlineChevronDown className="text-lg" />
//           </button>

//           {/* Dropdown Menu */}
//           {isDropdownOpen && (
//             <div
//               ref={dropdownRef} // Set ref to the dropdown menu
//               className="absolute right-0 mt-3 w-48 bg-white text-gray-900 rounded-lg shadow-lg border border-gray-300"
//             >
//               <Link to="/profile">
//                 <button
//                   onClick={() => setIsDropdownOpen(false)}
//                   className="block w-full text-left px-5 py-3 text-md font-medium hover:bg-gray-100 hover:text-gray-900 transition-all"
//                 >
//                   Profile
//                 </button>
//               </Link>

//               <button
//                 onClick={handleLogout}
//                 className="block w-full text-left px-5 py-3 text-md font-medium text-red-600 hover:bg-red-100 hover:text-red-700 transition-all"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../features/slices/authSlice";
import { adminLogout } from "../../../features/actions/authAction";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await dispatch(adminLogout());
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Force logout even if API call fails
      dispatch(logout());
      navigate("/login");
    }
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white text-black shadow-md border-b-4 border-blue-900">
      <div className="flex items-center justify-between px-6 py-2">
        {/* Logo Section */}
        <img
          src="/placeholder.svg?height=32&width=128"
          className="w-32 h-8"
          alt="Logo"
        />

        {/* User Info Section */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={toggleDropdown}
            className="flex items-center space-x-2 text-base font-medium hover:text-green-600 focus:outline-none"
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="hidden sm:inline">{user?.name || "Admin"}</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-3 w-48 bg-white text-gray-900 rounded-lg shadow-lg border border-gray-300"
            >
              <Link to="/profile">
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="block w-full text-left px-5 py-3 text-md font-medium hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  Profile
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-5 py-3 text-md font-medium text-red-600 hover:bg-red-100 hover:text-red-700 transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
