import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import CommunityLabel from "../components/CommunityLabel";
import "../assets/css/CategoryPosts.css";

const CategoryPosts = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const decodedCategory = decodeURIComponent(categoryName);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCommunity, setSelectedCommunity] = useState("");

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
        const fetchPostsByCategory = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/posts/category/${encodeURIComponent(decodedCategory)}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPostsByCategory();
    }, [decodedCategory]);

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

    const filteredPosts = posts.filter(
        (post) =>
            (!selectedCommunity || post.community === selectedCommunity)
    );

    return (
        <div>
            <Navbar />
            <div className="category-posts-container">
                <h2 className="category-title">{decodedCategory}</h2>

                <div className="category-post-content">
                     <button 
                        className="back-button" 
                        onClick={() => navigate("/homepage")}
                    >
                        ⬅ Back to Home
                    </button>
                </div>
                
                <div className="filter-container">
                    <label htmlFor="community-filter">Filter by Community</label>
                    <select
                        id="community-filter"
                        value={selectedCommunity}
                        onChange={(e) => setSelectedCommunity(e.target.value)}
                    >
                        <option value="">All</option>
                        {communities.map((community) => (
                            <option key={community} value={community}>
                                {community}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <p>Loading...</p>
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
                    <div className="posts-grid">
                        {filteredPosts.map((post) => (
                            <Link
                                key={post._id}
                                to={`/single-category-post/${encodeURIComponent(decodedCategory)}/post/${post._id}`}
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

                                    <p className="post-date">Posted: {formatPostDate(post.createdAt)}</p>
                                    <h3>{post.title}</h3>
                                    {post.image && (
                                        <img
                                            src={post.image}
                                            alt="Post visual"
                                            className="post-image"
                                        />
                                    )}
                                    {post.audio && (
                                        <audio controls className="post-audio">
                                            <source src={post.audio} type="audio/mpeg" />
                                            Your browser does not support the audio element
                                        </audio>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPosts;