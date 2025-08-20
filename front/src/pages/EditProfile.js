import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import defaultPic from "../assets/images/default-pic.png";
import "../assets/css/EditProfile.css";

const EditPage = () => {
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/users/auth", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setUsername(data.user.username);
                    setPreview(data.user.profilePicture || defaultPic);
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };
        fetchProfile();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("username", username);
            if (profilePicture) {
                formData.append("profilePicture", profilePicture);
            }

            const res = await fetch(`http://localhost:5000/api/users/${"me"}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                alert("Profile updated!");
                navigate("/profile");
            } else {
                alert(data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="profile-page">
                <h2>Edit Profile</h2>

                <form onSubmit={handleSubmit} className="edit-profile-form">
                    <div className="profile-pic-section">
                        <img
                            src={preview || defaultPic}
                            alt="Profile Preview"
                            className="profile-pic"
                        />
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPage;