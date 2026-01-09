import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE from "../utils/api";
import "../assets/css/ForgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API_BASE}/api/users/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Reset token generated!");
                
                // In production, I would email the token
                navigate("/reset-password", { state: { token: data.token } });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    };

    return (
        <div className="forgot-password-wrapper">
            <form onSubmit={handleSubmit}>
                <h1>Forgot Password</h1>
                <input 
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button type="submit">Send Reset Token</button>
            </form>
        </div>
    );
};

export default ForgotPassword;