"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Plus, ChevronRight, X } from "lucide-react";
import {
  getAllProducts,
  deleteProduct,
} from "../../features/actions/productAction";
import { getCategoryTree } from "../../features/actions/categoryAction";

const ListProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, isLoading, isError, error } = useSelector(
    (state) => state.products
  );
  const { categoryTree } = useSelector((state) => state.categories);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getCategoryTree());
  }, [dispatch]);

  // Debug logging
  useEffect(() => {
    console.log("Product List Debug:", {
      productList,
      isArray: Array.isArray(productList),
      length: productList?.length,
      isLoading,
      isError,
      error,
    });
  }, [productList, isLoading, isError, error]);

  const handleView = (product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handleEdit = (product) => {
    navigate(`/products/edit/${product._id}`);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setConfirmDelete(true);
  };

  const confirmDeleteProduct = async () => {
    await dispatch(deleteProduct(selectedProduct._id));
    setConfirmDelete(false);
    dispatch(getAllProducts());
  };

  const getCategoryPath = (categories) => {
    if (!categories || categories.length === 0) return "No categories";
    return categories.map((cat) => cat?.name || "Unknown").join(" → ");
  };

  const formatPrice = (price) => {
    return price ? `₹${price.toFixed(2)}` : "N/A";
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case "in_stock":
        return "text-green-600 bg-green-100";
      case "low_stock":
        return "text-yellow-600 bg-yellow-100";
      case "out_of_stock":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Show error state
  if (isError) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error Loading Products</h3>
          <p className="text-red-600 mt-1">
            {error || "Failed to load products"}
          </p>
          <button
            onClick={() => dispatch(getAllProducts())}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button
          onClick={() => navigate("/products/add-product")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Debug Information - Remove this in production */}
      {/* <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
        <strong>Debug Info:</strong>
        <br />
        Loading: {isLoading ? "Yes" : "No"}
        <br />
        Error: {isError ? "Yes" : "No"}
        <br />
        Product List Type: {typeof productList}
        <br />
        Is Array: {Array.isArray(productList) ? "Yes" : "No"}
        <br />
        Length: {productList?.length || 0}
        <br />
        Raw Data:{" "}
        {Array.isArray(productList)
          ? JSON.stringify(productList).substring(0, 100)
          : "Invalid or undefined data"}
      </div> */}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category Hierarchy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(productList) && productList.length > 0 ? (
                  productList.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {product.images && product.images.length > 0 ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={
                                  product.images[0] ||
                                  "/placeholder.svg?height=48&width=48"
                                }
                                alt={product.name}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              SKU: {product.sku}
                            </div>
                            {product.brand && (
                              <div className="text-xs text-gray-400">
                                {product.brand}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {getCategoryPath(product.categories)}
                        </div>
                        {product.primaryCategory && (
                          <div className="text-xs text-blue-600 mt-1">
                            Primary: {product.primaryCategory.name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(product.basePrice)}
                        </div>
                        {product.packOptions &&
                          product.packOptions.length > 0 && (
                            <div className="text-xs text-gray-500">
                              {product.packOptions[0].quantity}{" "}
                              {product.packOptions[0].unit} -{" "}
                              {formatPrice(product.packOptions[0].price)}
                            </div>
                          )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.stock?.level || 0}
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(
                            product.stock?.status
                          )}`}
                        >
                          {product.stock?.status?.replace("_", " ") ||
                            "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.isActive
                                ? "text-green-800 bg-green-100"
                                : "text-red-800 bg-red-100"
                            }`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                          {product.isFeatured && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-purple-800 bg-purple-100">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(product)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Product"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <div className="text-gray-500">
                        <p className="text-lg font-medium">No products found</p>
                        <p className="mt-1">
                          Get started by adding your first product.
                        </p>
                        <button
                          onClick={() => navigate("/products/add")}
                          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          Add Product
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Product Details
                </h3>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Product Images */}
                {selectedProduct.images &&
                  selectedProduct.images.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {selectedProduct.images.map((url, i) => (
                          <img
                            key={i}
                            src={url || "/placeholder.svg?height=96&width=96"}
                            alt={`${selectedProduct.name} ${i + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Name</h4>
                    <p className="text-gray-600">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">SKU</h4>
                    <p className="text-gray-600">{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Brand</h4>
                    <p className="text-gray-600">
                      {selectedProduct.brand || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Base Price</h4>
                    <p className="text-gray-600">
                      {formatPrice(selectedProduct.basePrice)}
                    </p>
                  </div>
                </div>

                {/* Category Hierarchy */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Category Hierarchy
                  </h4>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="flex items-center space-x-2 text-sm text-blue-700 flex-wrap">
                      {selectedProduct.categories?.map((category, index) => (
                        <div key={category._id} className="flex items-center">
                          <span className="bg-blue-100 px-2 py-1 rounded">
                            {category.name}
                          </span>
                          {index < selectedProduct.categories.length - 1 && (
                            <ChevronRight className="w-4 h-4 mx-1" />
                          )}
                        </div>
                      ))}
                    </div>
                    {selectedProduct.primaryCategory && (
                      <p className="text-xs text-blue-600 mt-2">
                        Primary Category: {selectedProduct.primaryCategory.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  <h4 className="font-medium text-gray-900">
                    Short Description
                  </h4>
                  <p className="text-gray-600">
                    {selectedProduct.shortDescription || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Description</h4>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                </div>

                {/* Pack Options */}
                {selectedProduct.packOptions &&
                  selectedProduct.packOptions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Pack Options
                      </h4>
                      <div className="space-y-2">
                        {selectedProduct.packOptions.map((option, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded">
                            <p className="text-sm">
                              <span className="font-medium">
                                {option.quantity} {option.unit}
                              </span>{" "}
                              - {formatPrice(option.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Stock & Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Stock Level</h4>
                    <p className="text-gray-600">
                      {selectedProduct.stock?.level || 0}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Stock Status</h4>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(
                        selectedProduct.stock?.status
                      )}`}
                    >
                      {selectedProduct.stock?.status?.replace("_", " ") ||
                        "Unknown"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Product Status
                    </h4>
                    <div className="space-y-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedProduct.isActive
                            ? "text-green-800 bg-green-100"
                            : "text-red-800 bg-red-100"
                        }`}
                      >
                        {selectedProduct.isActive ? "Active" : "Inactive"}
                      </span>
                      {selectedProduct.isFeatured && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-purple-800 bg-purple-100 ml-1">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* SEO */}
                {(selectedProduct.metaTitle ||
                  selectedProduct.metaDescription) && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      SEO Information
                    </h4>
                    <div className="space-y-2">
                      {selectedProduct.metaTitle && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Meta Title
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedProduct.metaTitle}
                          </p>
                        </div>
                      )}
                      {selectedProduct.metaDescription && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Meta Description
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedProduct.metaDescription}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    handleEdit(selectedProduct);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Edit Product
                </button>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Product
            </h4>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedProduct.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProduct;
