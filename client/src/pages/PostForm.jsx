// PostForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postService, categoryService } from "../services/api";

export default function PostForm({ edit, onPostSaved }) {
  const navigate = useNavigate();
  const { id } = useParams();

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load all categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data.data || data);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  // Load post data if editing
  useEffect(() => {
    if (edit && id) {
      const fetchPost = async () => {
        try {
          const res = await postService.getPost(id); // get full response
          const data = res.data || res; // safely extract .data if present

          // Fill form fields
          setTitle(data.title || "");
          setContent(data.content || "");
          setCategory(data.category?._id || data.category || "");
          
          // Set preview if an image exists
          if (data.featuredImage) {
            // Use full backend path if stored as filename
            const imageUrl = data.featuredImage.startsWith("http")
              ? data.featuredImage
              : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${data.featuredImage}`;
            setPreview(imageUrl);
          }
        } catch (err) {
          console.error(err);
          setError("Failed to load post data.");
        }
      };
      fetchPost();
    }
  }, [edit, id]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check if the category exists; create it if not
      let categoryId = category;
      const exists = categories.find(c => c._id === category || c.name.toLowerCase() === category.toLowerCase());
      if (!exists) {
        const newCat = await categoryService.createCategory({ name: category });
        categoryId = newCat.data._id || newCat._id;
        setCategories(prev => [...prev, newCat.data || newCat]);
      } else {
        categoryId = exists._id;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", categoryId);
      if (image) formData.append("image", image);

      // Create or update post
      let postData;
      if (edit) {
        postData = await postService.updatePost(id, formData);
      } else {
        postData = await postService.createPost(formData);
      }

      // Notify parent component
      if (onPostSaved) onPostSaved(postData);

      // Show success toast and redirect
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to submit post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded-md shadow-md relative">
      {/* Success Toast */}
      {success && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md animate-fade-in">
          {edit ? "Post updated!" : "Post created!"}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-primary">
        {edit ? "Edit Post" : "Create Post"}
      </h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />

        {/* Content */}
        <textarea
          placeholder="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          required
        />

        {/* Category */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Category</label>
          <input
            list="category-options"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Select or type a category"
          />
          <datalist id="category-options">
            {categories.map((c) => (
              <option key={c._id} value={c.name} />
            ))}
          </datalist>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 max-h-40 rounded-md object-cover border"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-accent transition-colors"
          >
            {loading ? "Submitting..." : edit ? "Update Post" : "Create Post"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
