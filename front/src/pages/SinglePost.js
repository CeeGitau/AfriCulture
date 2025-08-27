import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { FaTrash } from "react-icons/fa";
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
    const [newComment, setNewComment] = useState("");

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

    const handleLike = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ userId: currentUser._id }),
            });
            const updated = await res.json();
            setPost(updated.post);
        } catch (err) {
            console.error("Error liking post:", err);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: currentUser._id,
                    text: newComment
                }),
            });
            const updated = await res.json();
            setPost(updated.post);
            setNewComment("");
        } catch (err) {
            console.error("Error adding comment:", err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/posts/${postId}/comment/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: currentUser._id }),
            });
            const data = await res.json();
            setPost(data.post);
        } catch (err) {
            console.error("Error deleting comment:", err);
        }
    };

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
    const isLiked = Array.isArray(post.likes) && post.likes.includes(currentUser?._id);

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

                        <div className="likes-section">
                            <button onClick={handleLike}>
                                {isLiked ? "❤️" : "🤍"}
                            </button>
                            <span>{post.likes?.length || 0}</span>
                        </div>

                        {/* Comments Section */}
                        <div className="comments-section">
                            <h3>Comments</h3>
                            {post.comments?.length > 0 ? (
                                post.comments.map((comment, index) => (
                                    <div key={comment._id || index} className="comment">
                                        <strong>{comment.user?.username || "Anonymous"}:</strong> {comment.text}
                                        <small> · {formatPostDate(comment.createdAt)}</small>
                                        {comment.user?._id === currentUser?._id && (
                                            <button
                                                className="delete-comment-btn"
                                                title="Delete comment"
                                                onClick={() => {
                                                    if (window.confirm("Are you sure you want to delete your comment?")) {
                                                        handleDeleteComment(comment._id);
                                                    }
                                                }}
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No comments yet.</p>
                            )}

                            {currentUser && (
                                <div className="add-comment">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button onClick={handleAddComment}>Post</button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default SinglePost;