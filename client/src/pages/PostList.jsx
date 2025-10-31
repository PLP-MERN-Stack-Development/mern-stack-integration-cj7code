// client/src/pages/PostList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postService, categoryService } from '../services/api';
import useApi from '../hooks/useApi';

export default function PostList() {
  // State variables
  const [posts, setPosts] = useState([]);           // All posts
  const [categories, setCategories] = useState([]); // All categories
  const [page, setPage] = useState(1);             // Pagination
  const [q, setQ] = useState('');                  // Search query
  const [categoryId, setCategoryId] = useState(''); // Selected category

  // Custom hook to handle API calls with loading/error states
  const { run, loading, error } = useApi();

  // Load posts from backend with optional filters
  const loadPosts = async () => {
    const data = await run(postService.getAllPosts, page, 10, categoryId || null, q);
    setPosts(data.data || data); // Depending on API response shape
  };

  // Load all categories for the dropdown filter
  const loadCategories = async () => {
    const c = await run(categoryService.getAllCategories);
    setCategories(c.data || c);
  };

  // Fetch categories once on component mount
  useEffect(() => { loadCategories(); }, []);

  // Fetch posts whenever page, category, or search query changes
  useEffect(() => { loadPosts(); }, [page, categoryId, q]);

  return (
    <div>
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-4">
          Welcome to Jolofan's MERN Blog
        </h1>
      </div>

      {/* Filters and Create Post button */}
      <div className="mb-4 flex items-center gap-2">
        {/* Search input */}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search posts..."
          className="border p-2 rounded"
        />

        {/* Category filter dropdown */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All categories</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        {/* Link to create a new post */}
        <Link to="/create" className="ml-auto btn">Create Post</Link>
      </div>

      {/* Loading / Error states */}
      {loading && <p>Loading posts...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Posts list */}
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post._id} className="p-4 border rounded bg-white">
            {/* Post title */}
            <h3 className="text-xl font-semibold">
              <Link to={`/posts/${post._id}`}>{post.title}</Link>
            </h3>

            {/* Post excerpt */}
            <p className="text-sm text-gray-600">
              {post.excerpt || post.content.slice(0, 120) + '...'}
            </p>

            {/* Post meta info */}
            <div className="text-xs mt-2">
              <span>{post.category?.name || 'Uncategorized'}</span> •{' '}
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
