"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  getCategoryTree,
  getParentCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../features/actions/categoryAction";
import { ChevronDown, ChevronRight, Plus, Edit, Trash2, X } from "lucide-react";

const ListCategory = () => {
  const dispatch = useDispatch();
  const {
    categoryTree = [],
    // parentCategories = [],
    isLoading,
  } = useSelector((state) => state.categories);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [selectedParent, setSelectedParent] = useState("");

  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    dispatch(getCategoryTree());
    dispatch(getParentCategories());
  }, [dispatch]);

  const toggleExpanded = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    newExpanded.has(categoryId)
      ? newExpanded.delete(categoryId)
      : newExpanded.add(categoryId);
    setExpandedCategories(newExpanded);
  };

  const onSubmit = async (data) => {
    try {
      const categoryData = {
        ...data,
        parentCategory: data.parentCategory || null,
      };

      if (editingCategory) {
        await dispatch(
          updateCategory({ id: editingCategory._id, categoryData })
        );
        setEditingCategory(null);
      } else {
        await dispatch(addCategory(categoryData));
      }

      reset();
      setShowAddForm(false);
      setSelectedParent("");
      dispatch(getCategoryTree());
      dispatch(getParentCategories());
    } catch (err) {
      console.error("Failed to save category", err);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setValue("name", category.name);
    setValue("slug", category.slug);
    setValue("description", category.description || "");
    setValue("parentCategory", category.parentCategory?._id || "");
    setShowAddForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await dispatch(deleteCategory(categoryId));
      dispatch(getCategoryTree());
      dispatch(getParentCategories());
    }
  };

  const handleAddSubcategory = (parentId) => {
    setSelectedParent(parentId);
    setValue("parentCategory", parentId);
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setSelectedParent("");
    reset();
  };

  const renderCategoryTree = (categories = [], level = 0) =>
    categories.map((category) => (
      <div key={category._id} className="border-l-2 border-gray-200">
        <div
          className={`flex items-center justify-between p-3 hover:bg-gray-50`}
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="flex items-center space-x-2">
            {category.children?.length > 0 ? (
              <button
                onClick={() => toggleExpanded(category._id)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {expandedCategories.has(category._id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              <div className="w-6 h-6" />
            )}

            <div>
              <h3 className="font-medium text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.slug}</p>
              {category.description && (
                <p className="text-xs text-gray-400">{category.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {level < 2 && (
              <button
                onClick={() => handleAddSubcategory(category._id)}
                className="p-1 text-green-600 hover:bg-green-100 rounded"
                title="Add Subcategory"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => handleEdit(category)}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
              title="Edit Category"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(category._id)}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
              title="Delete Category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {category.children?.length > 0 &&
          expandedCategories.has(category._id) && (
            <div className="ml-4">
              {renderCategoryTree(category.children, level + 1)}
            </div>
          )}
      </div>
    ));

  const getAllCategoriesFlat = (categories = [], result = []) => {
    categories.forEach((category) => {
      result.push(category);
      if (category.children?.length > 0) {
        getAllCategoriesFlat(category.children, result);
      }
    });
    return result;
  };

  const flatCategories = getAllCategoriesFlat(categoryTree || []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Category Management
        </h1>
        {/* <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button> */}
      </div>
      {/* Category Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900">Total Categories</h3>
          <p className="text-2xl font-bold text-blue-600">
            {flatCategories?.length ?? 0}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-900">Parent Categories</h3>
          <p className="text-2xl font-bold text-green-600">
            {categoryTree?.length ?? 0}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-medium text-purple-900">Subcategories</h3>
          <p className="text-2xl font-bold text-purple-600">
            {(flatCategories?.length ?? 0) - (categoryTree?.length ?? 0)}
          </p>
        </div>
      </div>
      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>
              <button
                onClick={cancelForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  {...register("name", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  {...register("slug", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="category-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Parent Category
                </label>
                <select
                  {...register("parentCategory")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Parent Category (Optional)</option>
                  {flatCategories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Category description"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : editingCategory ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Tree */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Category Hierarchy</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <p>Loading categories...</p>
          </div>
        ) : (categoryTree?.length ?? 0) === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No categories found. Add your first category to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {renderCategoryTree(categoryTree)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListCategory;
