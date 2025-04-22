import React, { useState, useEffect, useContext } from "react";
import UserContext from "../contexts/UserContext";
import Navbar from "../components/Navbar";
import "../assets/css/profile.css";

const Profile = () => {
    const { user } = useContext(UserContext);
    const [profile, setProfile] = useState(null);

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
                    setProfile(data.user);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, []);

    if (!profile) return <p>Loading profile...</p>;

    return (
        <div className="profile-page">
            <Navbar />
            <h2>Welcome, {profile.username}</h2>
            <p><strong>Email:</strong> {profile.email}</p>
        </div>
    );
};

export default Profile;