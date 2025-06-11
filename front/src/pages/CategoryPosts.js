import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../assets/css/CategoryPosts.css";

const CategoryPosts = () => {
    const { categoryName } = useParams();
    const decodedCategory = decodeURIComponent(categoryName);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    return (
        <div>
            <Navbar />
            <div className="category-posts-container">
                <h2 className="category-title">{decodedCategory}</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error-text">{error}</p>
                ) : posts.length === 0 ? (
                    <div className="no-posts">
                        <p>No posts yet in this category</p>
                    </div>
                ) : (
                    <div className="posts-grid">
                        {posts.map((post) => (
                            <div key={post._id} className="post-card">
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
                                        Your browser does not support the audio element
                                    </audio>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPosts;