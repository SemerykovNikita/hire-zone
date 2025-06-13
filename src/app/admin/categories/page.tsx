// @ts-nocheck

"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/actions/categoryActions";

type Category = {
  id: string;
  name: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit" | "delete">(
    "create"
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const openModal = (
    type: "create" | "edit" | "delete",
    category: Category | null = null
  ) => {
    setModalType(type);
    setSelectedCategory(category);
    setCategoryName(category ? category.name : "");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCategoryName("");
    setSelectedCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modalType === "create") {
        const res = await createCategory(categoryName);
        if (res.success) {
          fetchCategories();
          closeModal();
        } else {
          alert("Error: " + res.error);
        }
      } else if (modalType === "edit" && selectedCategory) {
        const res = await updateCategory(selectedCategory.id, categoryName);
        if (res.success) {
          fetchCategories();
          closeModal();
        } else {
          alert("Error: " + res.error);
        }
      } else if (modalType === "delete" && selectedCategory) {
        const res = await deleteCategory(selectedCategory.id);
        if (res.success) {
          fetchCategories();
          closeModal();
        } else {
          alert("Error: " + res.error);
        }
      }
    } catch (error) {
      console.error("Operation error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <FolderTree className="h-8 w-8 text-gray-900" />
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Categories
            </h1>
          </div>
          <button
            onClick={() => openModal("create")}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </button>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono text-gray-500 sm:pl-6">
                          {category.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {category.name}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openModal("edit", category)}
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openModal("delete", category)}
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                      <h3 className="text-xl font-semibold leading-6 text-gray-900">
                        {modalType === "create" && "Create Category"}
                        {modalType === "edit" && "Edit Category"}
                        {modalType === "delete" && "Delete Category"}
                      </h3>
                      <div className="mt-2">
                        {modalType === "delete" ? (
                          <p className="text-sm text-gray-500">
                            Are you sure you want to delete the category "
                            {selectedCategory?.name}"? This action cannot be
                            undone.
                          </p>
                        ) : (
                          <form onSubmit={handleSubmit} className="mt-4">
                            <div className="mb-4">
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Category Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                value={categoryName}
                                onChange={(e) =>
                                  setCategoryName(e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                                placeholder="Enter category name"
                                required
                              />
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${
                        modalType === "delete"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-black hover:bg-gray-800"
                      }`}
                    >
                      {modalType === "delete" ? "Delete" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
