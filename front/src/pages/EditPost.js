import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../assets/css/EditPost.css";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setPost(data);
          setContent(data.content);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }), // ✅ only send updated content
      });

      const data = await res.json();
      if (res.ok) {
        alert("Post updated successfully!");
        navigate(`/single-post/${id}`);
      } else {
        alert(data.message || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (!post) return <p>Post not found</p>;

  const formatPostDate = (createdAt) => {
    const postDate = new Date(createdAt);
    return postDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <Navbar />
      <div className="edit-post-container">
        <h2>Edit Post</h2>

        {/* Show non-editable details */}
        <div className="post-details">
          <p><strong>Title:</strong> {post.title}</p>
          <p><strong>Category:</strong> {post.category}</p>
          <p><strong>Community:</strong> {post.community}</p>
          <p><strong>Author:</strong> {post.user?.username}</p>
          <p><strong>Date:</strong> {formatPostDate(post.createdAt)}</p>

          {post.image && <img src={post.image} alt="Post visual" />}
          {post.audio && (
            <audio controls>
              <source src={post.audio} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>

        {/* Editable content */}
        <form onSubmit={handleSubmit} className="edit-post-form">
          <div>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="8"
              required
            />
          </div>

          <div className="edit-post-actions">
            <button type="submit" className="save-btn">
              Save Changes
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
