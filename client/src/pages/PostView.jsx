// client/src/pages/PostView.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postService } from '../services/api';
import useApi from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

export default function PostView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const { run, loading, error } = useApi();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const data = await run(postService.getPost, id);
      setPost(data.data || data);
    })().catch(console.error);
  }, [id]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      const added = await run(postService.addComment, id, { content: comment });
      // optimistic: append to local comments
      setPost(prev => ({ ...prev, comments: [...(prev.comments || []), added.data || added] }));
      setComment('');
    } catch (err) { /* error shown by useApi */ }
  };

  if (loading && !post) return <p>Loading...</p>;
  if (error && !post) return <p className="text-red-600">{error}</p>;

  const canEdit = user && post?.author?._id === user.id;

  return (
    <div>
      {post && (
        <>
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <div className="text-sm text-gray-600 mb-4">
            {post.category?.name} • {new Date(post.createdAt).toLocaleDateString()}
            {canEdit && <Link to={`/edit/${post._id}`} className="ml-4 text-blue-600">Edit</Link>}
          </div>
          {post.featuredImage && <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${post.featuredImage}`} alt="" className="mb-4 max-w-full" />}
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
          <hr className="my-6" />
          <div>
            <h3 className="font-semibold">Comments</h3>
            <ul className="space-y-2">
              {post.comments?.map((c, idx) => (
                <li key={idx} className="p-2 border rounded">
                  <div className="text-sm text-gray-700">{c.content}</div>
                  <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
            {user ? (
              <div className="mt-4">
                <textarea value={comment} onChange={e=>setComment(e.target.value)} className="w-full p-2 border rounded" placeholder="Write a comment..." />
                <button onClick={handleAddComment} className="mt-2 btn">Add Comment</button>
              </div>
            ) : (
              <div className="mt-4">Please <Link to="/login" className="text-blue-600">login</Link> to comment.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
