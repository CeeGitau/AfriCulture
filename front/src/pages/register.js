import React, { useState, useContext } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../assets/css/register.css";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Registration successful");

        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        setTimeout(() => navigate("/homepage"), 1000) ;
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again");
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h1>Register</h1>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
};

export default Register;
