// LoginPage Client
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset previous errors
    try {
      await login({ email, password }); // wait for backend response
      navigate("/"); // redirect after successful login
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to login. Please check credentials.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-primary">Login</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          Login
        </button>
      </form>
    </div>
  );
}
