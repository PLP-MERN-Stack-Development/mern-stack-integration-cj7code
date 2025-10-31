// client/src/components/Nav.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Nav() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-teal-600 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="font-bold text-xl hover:text-teal-300 transition">
          MERN Blog
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className="hover:text-teal-300 transition">Posts</Link>
          {user ? (
            <>
              <Link to="/create" className="hover:text-teal-300 transition">Create</Link>
              <button onClick={logout} className="hover:text-teal-300 underline transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-teal-300 transition">Login</Link>
              <Link to="/register" className="hover:text-teal-300 transition">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
