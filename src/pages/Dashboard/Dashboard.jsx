import { useNavigate } from "react-router-dom";
import { FaUsers, FaBlog, FaTachometerAlt } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();

  // Keep the same sections as your original - no fake data
  const sections = [
    {
      id: 1,
      title: "Category",
      route: "/category",
      icon: <FaUsers className="text-blue-500" />,
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      title: "Product",
      route: "/product",
      icon: <FaBlog className="text-green-500" />,
      bgColor: "bg-green-50",
    },
    {
      id: 3,
      title: "User",
      route: "/user",
      icon: <FaTachometerAlt className="text-purple-500" />,
      bgColor: "bg-purple-50",
    },
    {
      id: 4,
      title: "Order",
      route: "/order",
      icon: <FaTachometerAlt className="text-purple-500" />,
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome to the Admin Panel. Here's what's happening today.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards - No fake data, just navigation cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sections.map((section) => (
            <div
              key={section.id}
              onClick={() => navigate(section.route)}
              className="cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-center mb-4">
                <div className={`p-4 rounded-lg ${section.bgColor}`}>
                  {section.icon}
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  Manage {section.title.toLowerCase()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section - Simple layout without fake data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Overview - Simple placeholder */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Activity Overview
              </h2>
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
            </div>

            {/* Simple placeholder for future chart integration */}
            <div className="h-64 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-500 mb-2">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                </div>
                <p className="text-gray-600">Chart will be displayed here</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>
              <span className="text-sm text-gray-500">
                Frequently used actions
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/partners/add-partner")}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUsers className="text-blue-600 text-sm" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Add Category
                    </div>
                    <div className="text-sm text-gray-500">
                      Create new partner
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate("/blogs/add-blog")}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FaBlog className="text-green-600 text-sm" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Add Product</div>
                    <div className="text-sm text-gray-500">
                      Create new blog post
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate("/partners")}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <FaTachometerAlt className="text-purple-600 text-sm" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      View Partners
                    </div>
                    <div className="text-sm text-gray-500">
                      Manage all partners
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
