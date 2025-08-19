import React, { useState, useEffect, useContext } from "react";
import UserContext from "../contexts/UserContext";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import Navbar from "../components/Navbar";
import defaultPic from "../assets/images/default-pic.png";
import "../assets/css/profile.css";

const Profile = () => {
    const { user } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [myPosts, setMyPosts] = useState([]);

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
                    fetchUserPosts(data.user._id);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        const fetchUserPosts = async (userId) => {
            try {
                const res = await fetch(`http://localhost:5000/api/posts/user/${userId}`);
                const data = await res.json();
                if (res.ok) {
                    setMyPosts(data);
                } else {
                    console.error("Failed to fetch user posts");
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchProfile();
    }, []);

    if (!profile) return <p>Loading profile...</p>;

    return (
        <div >
            <Navbar />
            <div className="profile-page">
                <div className="profile-meta-content">
                    <img
                        className="profile-pic"
                        src={profile.profilePicture || defaultPic}
                        alt="Profile"
                    />

                    <Link to="/edit-profile">
                        <FaEdit style={{ color: "white", fontSize: "45px" }} />
                    </Link>
                </div>

                <h2>Welcome, {profile.username}</h2>
                <p><strong>Email:</strong> {profile.email}</p>
            </div>

            <div className="my-posts">
                <h3>My Posts</h3>
                {myPosts.length === 0 ? (
                    <p>You haven't posted anything yet.</p>
                ) : (
                    <ul className="my-posts-list">
                        {myPosts.map(post => (
                            <li key={post._id} className="post-item">
                                <h4>{post.title}</h4>
                                <p>{post.content.slice(0, 100)}...</p>
                                <Link to={`/single-post/${post._id}`} className="read-more-link">Read more</Link>
                            </li>
                        ))}
                    </ul>

                )}
            </div>

        </div>
    );
};

export default Profile;