import React from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition">
      {post.featuredImage && (
        <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">
          <Link to={`/posts/${post._id}`} className="hover:text-accent transition">{post.title}</Link>
        </h2>
        <p className="text-gray-600 mb-2">{post.excerpt || post.content.slice(0, 100) + '...'}</p>
        <div className="text-sm text-gray-500 flex justify-between">
          <span>{post.category?.name}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
