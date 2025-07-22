"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Minus, X, ChevronRight } from "lucide-react";
import { getCategoryTree } from "../../features/actions/categoryAction";
import { createProduct } from "../../features/actions/productAction";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.products);
  const { categoryTree } = useSelector((state) => state.categories);

  const [imageUrls, setImageUrls] = useState([""]);
  const [categoryPath, setCategoryPath] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      sku: "",
      brand: "",
      description: "",
      shortDescription: "",
      basePrice: 0,
      primaryCategory: "",
      packOptions: [{ unit: "", quantity: 1, price: 0 }],
      stock: { level: 0, status: "in_stock" },
      metaTitle: "",
      metaDescription: "",
      isFeatured: false,
      isActive: true,
    },
  });

  // ---------------------- Category selection changes start
  const [selectedCategories, setSelectedCategories] = useState([]); // holds level 1 -> 3

  const handleCategorySelect = (level, categoryId) => {
    const updated = [...selectedCategories.slice(0, level), categoryId];
    setSelectedCategories(updated);
    setValue("primaryCategory", categoryId); // deepest selected category
  };

  const getCategoryOptionsAtLevel = (level) => {
    let current = categoryTree;
    for (let i = 0; i < level; i++) {
      const selectedId = selectedCategories[i];
      const found = current.find((cat) => cat._id === selectedId);
      if (!found || !found.children) return [];
      current = found.children;
    }
    return current;
  };

  const findCategoryNameById = (id, categories) => {
    for (const cat of categories) {
      if (cat._id === id) return cat.name;
      if (cat.children?.length) {
        const result = findCategoryNameById(id, cat.children);
        if (result) return result;
      }
    }
    return "Unknown";
  };
  // ---------------------- Category selection changes end

  const { fields, append, remove } = useFieldArray({
    control,
    name: "packOptions",
  });

  const watchName = watch("name");
  const watchPrimaryCategory = watch("primaryCategory");

  useEffect(() => {
    dispatch(getCategoryTree());
  }, [dispatch]);

  useEffect(() => {
    if (watchName) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setValue("slug", slug);
    }
  }, [watchName, setValue]);

  // Update category path when primary category changes
  useEffect(() => {
    if (watchPrimaryCategory) {
      const path = findCategoryPath(categoryTree, watchPrimaryCategory);
      setCategoryPath(path || []);
    } else {
      setCategoryPath([]);
    }
  }, [watchPrimaryCategory, categoryTree]);

  const findCategoryPath = (categories, targetId, currentPath = []) => {
    for (const category of categories) {
      const newPath = [...currentPath, category];

      if (category._id === targetId) {
        return newPath;
      }

      if (category.children && category.children.length > 0) {
        const foundPath = findCategoryPath(
          category.children,
          targetId,
          newPath
        );
        if (foundPath) {
          return foundPath;
        }
      }
    }
    return null;
  };

  const renderCategoryOptions = (categories, level = 0) => {
    return categories.map((category) => (
      <div key={category._id}>
        <option value={category._id} style={{ paddingLeft: `${level * 20}px` }}>
          {"—".repeat(level)} {category.name}
        </option>
        {category.children &&
          category.children.length > 0 &&
          renderCategoryOptions(category.children, level + 1)}
      </div>
    ));
  };

  const handleImageUrlChange = (index, value) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const removeImageUrl = (index) => {
    const updated = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updated);
  };

  const onSubmit = async (data) => {
    const finalProduct = {
      ...data,
      basePrice: Number(data.basePrice),
      images: imageUrls.filter((url) => url.trim() !== ""),
      primaryCategory: data.primaryCategory || null,
      packOptions: data.packOptions.map((opt) => ({
        ...opt,
        quantity: Number(opt.quantity),
        price: Number(opt.price),
      })),
      stock: {
        level: Number(data.stock.level),
        status: data.stock.status,
      },
    };

    const res = await dispatch(createProduct(finalProduct));
    if (createProduct.fulfilled.match(res)) {
      navigate("/products");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Add Product</h1>
            <p className="text-gray-600">Fill in the product details</p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="p-6 bg-white rounded shadow border space-y-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Name *
                </label>
                <input
                  {...register("name", {
                    required: "Product name is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">SKU *</label>
                <input
                  {...register("sku", { required: "SKU is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter SKU"
                />
                {errors.sku && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.sku.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <input
                  {...register("slug", { required: "Slug is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="product-slug"
                />
                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>
                <input
                  {...register("brand")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Base Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("basePrice", {
                    required: "Base price is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
                {errors.basePrice && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.basePrice.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Short Description
                </label>
                <input
                  {...register("shortDescription")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief product description"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Description *
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Detailed product description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Category Selection */}
          {/* <div className="p-6 bg-white rounded shadow border">
            <h2 className="text-lg font-semibold mb-4">Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Primary Category *
                </label>
                <select
                  {...register("primaryCategory", {
                    required: "Please select a category",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {renderCategoryOptions(categoryTree)}
                </select>
                {errors.primaryCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.primaryCategory.message}
                  </p>
                )}
              </div>

              {categoryPath.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-blue-800 mb-2">
                    This product will be automatically added to these
                    categories:
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-blue-700 flex-wrap">
                    {categoryPath.map((category, index) => (
                      <div key={category._id} className="flex items-center">
                        <span className="bg-blue-100 px-3 py-1 rounded-full">
                          {category.name}
                        </span>
                        {index < categoryPath.length - 1 && (
                          <ChevronRight className="w-4 h-4 mx-2" />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Products in "{categoryPath[categoryPath.length - 1]?.name}"
                    will also appear when browsing parent categories.
                  </p>
                </div>
              )}
            </div>
          </div> */}

          {/* ---------------------- REPLACED: Category Selection Section START ---------------------- */}
          <div className="p-6 bg-white rounded shadow border">
            <h2 className="text-lg font-semibold mb-4">Category</h2>
            <div className="space-y-4">
              {[0, 1, 2].map((level) => {
                const options = getCategoryOptionsAtLevel(level);
                if (options.length === 0) return null;

                return (
                  <div key={level}>
                    <label className="block text-sm font-medium mb-1">
                      Select Category {level + 1}
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={selectedCategories[level] || ""}
                      onChange={(e) =>
                        handleCategorySelect(level, e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      {options.map((opt) => (
                        <option key={opt._id} value={opt._id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}

              {/* {selectedCategories.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-blue-800 mb-2">
                    Selected Category Path:
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-blue-700 flex-wrap">
                    {selectedCategories.map((id, idx) => {
                      const pathName = findCategoryNameById(id, categoryTree);
                      return (
                        <div key={id} className="flex items-center">
                          <span className="bg-blue-100 px-3 py-1 rounded-full">
                            {pathName}
                          </span>
                          {idx < selectedCategories.length - 1 && (
                            <ChevronRight className="w-4 h-4 mx-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )} */}

              {/* Set error if no category is selected */}
              {errors.primaryCategory && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.primaryCategory.message}
                </p>
              )}
            </div>
          </div>
          {/* ---------------------- REPLACED: Category Selection Section END ---------------------- */}

          {/* Pack Options */}
          <div className="p-6 bg-white rounded shadow border space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Pack Options</h2>
              <button
                type="button"
                onClick={() => append({ unit: "", quantity: 1, price: 0 })}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Option</span>
              </button>
            </div>

            {fields.map((field, idx) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">Unit</label>
                  <input
                    {...register(`packOptions.${idx}.unit`, {
                      required: "Unit is required",
                    })}
                    placeholder="e.g., kg, piece, box"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    {...register(`packOptions.${idx}.quantity`, {
                      required: "Quantity is required",
                    })}
                    placeholder="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`packOptions.${idx}.price`, {
                      required: "Price is required",
                    })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Images */}
          <div className="p-6 bg-white rounded shadow border space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Product Images</h2>
              <button
                type="button"
                onClick={addImageUrl}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Image
              </button>
            </div>

            {imageUrls.map((url, i) => (
              <div key={i} className="flex items-center space-x-3">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleImageUrlChange(i, e.target.value)}
                  placeholder="https://image-url.com/image.jpg"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageUrl(i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Stock */}
          <div className="p-6 bg-white rounded shadow border">
            <h2 className="text-lg font-semibold mb-4">Stock Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Stock Level
                </label>
                <input
                  type="number"
                  min={0}
                  {...register("stock.level", {
                    required: "Stock level is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Stock Status
                </label>
                <select
                  {...register("stock.status")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* SEO & Settings */}
          <div className="p-6 bg-white rounded shadow border space-y-4">
            <h2 className="text-lg font-semibold">SEO & Settings</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Meta Title
                </label>
                <input
                  {...register("metaTitle")}
                  placeholder="SEO title for search engines"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Meta Description
                </label>
                <textarea
                  {...register("metaDescription")}
                  placeholder="SEO description for search engines"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register("isFeatured")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Featured Product</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register("isActive")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Active</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
