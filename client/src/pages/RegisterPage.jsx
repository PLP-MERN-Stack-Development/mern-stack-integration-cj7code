// client/src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register({ name: fullName, email, password }); // send correct fields to backend
      navigate("/login"); // redirect after successful registration
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to register. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-primary">Register</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />

        <button
          type="submit"
          className="bg-primary text-white py-2 rounded-md hover:bg-accent transition-colors"
        >
          Register
        </button>
      </form>
    </div>
  );
}
