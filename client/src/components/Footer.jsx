import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-8">
        {/* Main navy block (full width) */}
        <div className="bg-primary text-textLight w-full py-4">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Brand */}
            <div>
                <h2 className="text-2xl font-bold text-accent mb-1">MERN Blog</h2>
                <p className="text-sm text-textLight/80 leading-snug">
                A simple blog platform built with the MERN stack. Share your ideas, learn, and grow with a community of developers.
                </p>
            </div>

            {/* Quick Links */}
            <div>
                <h3 className="text-lg font-semibold text-accent mb-1">Quick Links</h3>
                <ul className="space-y-1 text-sm">
                <li>
                    <Link to="/" className="hover:text-accent transition-colors">Home</Link>
                </li>
                <li>
                    <Link to="/create" className="hover:text-accent transition-colors">Create Post</Link>
                </li>
                <li>
                    <Link to="/login" className="hover:text-accent transition-colors">Login</Link>
                </li>
                <li>
                    <Link to="/register" className="hover:text-accent transition-colors">Register</Link>
                </li>
                </ul>
            </div>

            {/* Contact */}
            <div>
                <h3 className="text-lg font-semibold text-accent mb-1">Contact</h3>
                <ul className="space-y-1 text-sm">
                <li>Email: <a href="mailto:info@mernblog.com" className="hover:text-accent">info@mernblog.com</a></li>
                <li>GitHub: <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent">github.com/mernblog</a></li>
                <li>Twitter: <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent">@mernblog</a></li>
                </ul>
            </div>
            </div>
        </div>

        {/* Bottom bar (full width) */}
        <div className="bg-secondary text-textLight text-center text-sm py-2 border-t border-accent/30">
            © {new Date().getFullYear()} MERN Blog — All rights reserved.
        </div>
    </footer>

  );
}
