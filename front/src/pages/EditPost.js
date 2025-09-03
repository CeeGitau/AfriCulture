import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
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
        body: JSON.stringify({ content }), // only send updated content
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Post updated successfully!");
        navigate(`/single-post/${id}`);
      } else {
        toast.error(data.message || "Failed to update post");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again");
      console.error("Error updating post:", error);
    }
  };

  if (loading) return <Loader />;
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
          <p className="post-title">{post.title}</p>
          <p className="post-category">{post.category}</p>
          <p className="post-community">{post.community}</p>
          <div className="post-meta">
            <span>{post.user?.username}</span>
            <span>{formatPostDate(post.createdAt)}</span>
          </div>

          {post.image && <img src={post.image} alt="Post visual" />}

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
