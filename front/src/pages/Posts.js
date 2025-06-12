import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../assets/css/Posts.css";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/posts/all-posts");
                if (!res.ok) {
                    throw new Error("Failed to fetch all posts");
                }

                const data = await res.json();
                setPosts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllPosts();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="posts-page-container">
                <h1 className="posts-page-title">All Posts</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error-text">{error}</p>
                ) : posts.length === 0 ? (
                    <p>No posts yet</p>
                ) : (
                    <div className="posts-page-grid">
                        {posts.map((post) => (
                            <div key={post._id} className="post-card">
                                <p className="post-username">Posted by: {post.user?.username}</p>
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>
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
                                        Your browser does not support the audio element.
                                    </audio>
                                )}
                                <p className="post-date">
                                    {new Date(post.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Posts;