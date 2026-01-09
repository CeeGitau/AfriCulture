import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import CommunityLabel from "../components/CommunityLabel";
import Loader from "../components/Loader";
import API_BASE from "../utils/api";
import "../assets/css/Posts.css";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCommunity, setSelectedCommunity] = useState("");
    const navigate = useNavigate();

    const communities = [
        "Kikuyu",
        "Luhya",
        "Kalenjin",
        "Luo",
        "Kamba",
        "Somali",
        "Kisii",
        "Mijikenda",
        "Maasai",
        "Taita",
        "Embu",
        "Meru",
        "Turkana",
        "Teso",
        "Ilchamus",
        "Samburu",
        "Rendille",
        "Borana",
        "Gabra",
        "Pokot",
        "Njemps",
        "Galla",
        "Ndorobo",
        "Suba",
        "Ogiek",
        "El Molo",
        "Kuria",
        "Malakote",
        "Swahili",
        "Arabs",
        "Waat",
        "Nubians",
        "Boni",
        "Giriama",
        "Digo",
        "Taveta",
        "Bajuni",
        "Orma",
        "Burji",
        "Sakuye",
    ];

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/posts/all-posts`);
                if (!res.ok) {
                    throw new Error("Failed to fetch all posts");
                }

                const data = await res.json();
                setPosts(data);
            } catch (error) {
                setError(error.message);
                toast.error(error.message || "Something went wrong while fetching posts");
            } finally {
                setLoading(false);
            }
        };

        fetchAllPosts();
    }, []);

    const formatPostDate = (createdAt) => {
        const postDate = new Date(createdAt);
        const now = new Date();
        const diffMs = now - postDate;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffMinutes < 1) {
            return "Just now";
        } else if (diffMinutes < 60) {
            return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        } else {
            return postDate.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    };

    const filteredPosts = selectedCommunity
        ? posts.filter(post => post.community === selectedCommunity)
        : posts;

    return (
        <div>
            <Navbar />
            <div className="posts-page-container">
                <div className="heading-container">
                    <h1 className="posts-page-title">All Posts</h1>

                    <button
                        className="back-button"
                        onClick={() => navigate("/homepage")}
                    >
                        ⬅ Back to Home
                    </button>
                </div>

                <div className="filter-container">
                    <label htmlFor="communityFilter">Filter by Community</label>
                    <select
                        id="communityFilter"
                        value={selectedCommunity}
                        onChange={(e) => setSelectedCommunity(e.target.value)}
                    >
                        <option value="">All</option>
                        {communities.map((community, index) => (
                            <option key={index} value={community}>
                                {community}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <Loader />
                ) : error ? (
                    <p className="error-text">{error}</p>
                ) : filteredPosts.length === 0 ? (
                    selectedCommunity ? (
                        <div className="no-posts">
                            <p>No posts for this community yet</p>

                            <div className="add-post-button">
                                <Link to="/add-post" className="post-link">Add a post</Link>
                            </div>
                        </div>
                    ) : (
                        <div className="no-posts">
                            <p className="">No posts yet</p>

                            <div className="add-post-button">
                                <Link to="/add-post" className="post-link">Add a post</Link>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="posts-page-grid">
                        {filteredPosts.map((post) => (
                            <Link
                                key={post._id}
                                to={`/single-post/${post._id}`}
                                className="post-card-link"
                            >
                                <div className="post-card">
                                    <CommunityLabel community={post.community} />

                                    <div className="post-user">
                                        <img
                                            src={post.user?.profilePicture
                                                ? `http://localhost:5000${post.user.profilePicture}`
                                                : "/default-pic.png"}
                                            alt={post.user?.username || "User"}
                                            className="post-user-avatar"
                                        />

                                        <span className="post-username">{post.user?.username || "Anonymous"}</span>
                                    </div>

                                    <p className="post-date">
                                        Posted: {formatPostDate(post.createdAt)}
                                    </p>

                                    <h3>{post.title}</h3>
                                    {post.image && (
                                        <img
                                            src={post.image}
                                            alt="Post visual"
                                            className="post-image"
                                        />
                                    )}

                                    {/* Likes & Comments count */}
                                    <div className="post-stats">
                                        <span className="likes">❤️ {post.likes?.length || 0}</span>
                                        <span className="comments">💬 {post.comments?.length || 0}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Posts;