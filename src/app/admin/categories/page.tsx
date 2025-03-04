"use client";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/categoryActions";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";

const CategoriesAdminPage = () => {
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit" | "delete">(
    "create"
  );
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    Modal.setAppElement("body");
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (res.success) {
        setCategories(res.data);
      } else {
        console.error("Error fetching categories:", res.error);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const openModal = (
    type: "create" | "edit" | "delete",
    category: { id: string; name: string } | null = null
  ) => {
    setModalType(type);
    setSelectedCategory(category);
    setCategoryName(category ? category.name : "");
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
    <div>
      <h1>Category Management</h1>
      <button onClick={() => openModal("create")}>Create Category</button>
      <table border={1} cellPadding={5} style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>
                <button onClick={() => openModal("edit", cat)}>Edit</button>
                <button onClick={() => openModal("delete", cat)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Category Modal"
      >
        <h2>
          {modalType === "create" && "Create Category"}
          {modalType === "edit" && "Edit Category"}
          {modalType === "delete" && "Delete Category"}
        </h2>
        <form onSubmit={handleSubmit}>
          {(modalType === "create" || modalType === "edit") && (
            <div>
              <label>Name: </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </div>
          )}
          {modalType === "delete" && (
            <p>
              Are you sure you want to delete the category "
              {selectedCategory?.name}"?
            </p>
          )}
          <div style={{ marginTop: "10px" }}>
            <button type="submit">
              {modalType === "delete" ? "Delete" : "Save"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoriesAdminPage;
