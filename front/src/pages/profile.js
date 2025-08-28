import React, { useState, useEffect, useContext } from "react";
import UserContext from "../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import defaultPic from "../assets/images/default-pic.png";
import "../assets/css/profile.css";

const Profile = () => {
    const { user } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [myPosts, setMyPosts] = useState([]);
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
                    setProfile(data.user);
                    fetchUserPosts(data.user._id);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                toast.error("Error fetching profile");
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
                    toast.error("Failed to fetch user posts");
                    console.error("Failed to fetch user posts");
                }
            } catch (error) {
                toast.error("Something went wrong.Please try again");
                console.error("Error fetching posts:", error);
            }
        };

        fetchProfile();
    }, []);

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                setMyPosts(myPosts.filter(post => post._id !== postId));
            } else {
                console.error("Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    if (!profile) return <p>Loading profile...</p>;

    return (
        <div >
            <Navbar />
            <div className="profile-page">
                <div className="profile-meta-content">
                    <img
                        className="profile-pic"
                        src={profile.profilePicture ? `http://localhost:5000${profile.profilePicture}` : defaultPic} 
                        alt="Profile"
                    />

                    <Link to="/edit-profile">
                        <FaEdit style={{ color: "white", fontSize: "45px" }} title="Edit Profile" />
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
                                <div className="post-actions">
                                    <Link to={`/single-post/${post._id}`} className="read-more-link" title="read entire post">
                                        Read more
                                    </Link>

                                    <Link
                                        to={`/edit-post/${post._id}`}
                                        title="Edit Post"
                                        className="edit-icon"
                                    >
                                        <FaEdit style={{ color: "blue", fontSize: "18px" }} />
                                    </Link>
                                    
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        title="Delete Post"
                                        className="delete-icon"
                                    >
                                        <FaTrash style={{ color: "red", fontSize: "18px" }} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                )}
            </div>

        </div>
    );
};

export default Profile;