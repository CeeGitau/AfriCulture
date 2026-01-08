import React, { useState } from "react";
import { toast } from "react-toastify";
import API_BASE from "../utils/api";
import "../assets/css/ResetPassword.css";

const ResetPassword = () => {
    const [formData, setFormData] = useState({ token: "", newPassword: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API_BASE}/api/users/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    };

    return (
        <div className="reset-password-wrapper">
            <form onSubmit={handleSubmit}>
                <h1>Reset Password</h1>
                <input 
                    type="text"
                    placeholder="Reset Token"
                    value={formData.token}
                    onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                    required
                />

                <input
                    type="password"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value})}
                    required
                />

                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
}

export default ResetPassword;