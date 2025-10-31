// client/src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import PostList from './pages/PostList';
import PostView from './pages/PostView';
import PostForm from './pages/PostForm';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';

// Protected route wrapper
const Protected = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  const [postsUpdated, setPostsUpdated] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-textPrimary">
      {/* Navbar */}
      <Nav />

      {/* Main content */}
      <main className="flex-grow container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<PostList />} />
          <Route path="/posts/:id" element={<PostView />} />
          <Route path="/create" element={<Protected><PostForm onPostSaved={() => setPostsUpdated(prev => !prev)} /></Protected>}/>
          <Route path="/edit/:id" element={<Protected><PostForm edit onPostSaved={() => setPostsUpdated(prev => !prev)} /></Protected>}/>
          <Route path="*" element={<Navigate to="/" replace />} />
          {/* TODO: Add login/register pages - Done*/}
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
