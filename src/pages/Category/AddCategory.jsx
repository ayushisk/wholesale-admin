import React from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  addCategory,
  getAllCategories,
} from "../../features/actions/categoryAction";

const AddCategory = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await dispatch(addCategory(data));
      dispatch(getAllCategories());
      reset();
    } catch (err) {
      console.error("Failed to add category", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-md shadow-md">
        <h2 className="text-center text-2xl font-semibold mb-6">
          Add Category
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              {...register("name", { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Category name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              {...register("slug", { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="category-slug"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Category description"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
