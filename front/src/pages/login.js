import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import UserContext from "../contexts/UserContext";
import API_BASE from "../utils/api";
import "../assets/css/login.css";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API_BASE}/api/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || "Login succesful");

                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);

                setTimeout(() => navigate("/homepage"), 1000);
            } else {
                toast.error(data.message || "Login failed");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again");
            console.error("Login error:", error);
        }
    };

    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit} className="login-form">
                <h1>Login</h1>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <div className="forgot-password">
                    <Link to="/forgot-password">Forgot password?</Link>
                </div>

                <button type="submit">Login</button>
                
                <p className="register-text">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;