import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";
import Navbar from "../components/Navbar";
import "../assets/css/SinglePost.css";

const SinglePost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useContext(UserContext);

    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/posts/${postId}`);
                if (!res.ok) throw new Error("Post not found");
                const data = await res.json();
                setPost(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    const formatPostDate = (createdAt) => {
        const postDate = new Date(createdAt);
        const now = new Date();
        const diffMs = now - postDate;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffMinutes < 1) return "Just now";
        if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

        return postDate.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    if (loading) return <div className="loader">Loading post...</div>;
    if (error) return <p>Error: {error}</p>;
    if (!post) return <p>No post data available.</p>;

    const isAuthor = currentUser?._id === post.user?._id;

    return (
        <div>
            <Navbar />
            <div className="single-post-wrapper">

                <div className="single-post-content">
                    <button
                        className="back-button"
                        onClick={() => navigate("/all-posts")}
                    >
                        ⬅ Back
                    </button>

                    <div className="single-post-container">
                        <div className="category-badge">
                            <span> {post.category}</span>
                        </div>

                        <h2>{post.title}</h2>
                        <div className="meta">
                            {isAuthor ? (
                                <p>You posted · {formatPostDate(post.createdAt)}</p>
                            ) : (
                                <p>By {post.user?.username} · {formatPostDate(post.createdAt)}</p>
                            )}
                            <p>🏘️ Community: {post.community}</p>
                        </div>

                        <p>{post.content}</p>

                        {post.image && <img src={post.image} alt="Post visual" />}
                        {post.audio && (
                            <audio controls>
                                <source src={post.audio} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SinglePost;