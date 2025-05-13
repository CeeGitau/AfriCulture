import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import Navbar from "../components/Navbar";
import "../assets/css/AddPost.css";

const AddPost = () => {
    const [image, setImage] = useState("");
    const [audio, setAudio] = useState("");
    const [values, setValues] = useState({
        category: "",
        title: "",
        content: "",
    });

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const categories = [
        "Food & Cuisine",
        "Clothing & Fashion",
        "Music & Dance",
        "Languages & Culture",
        "Festivals & Holidays",
        "Arts & Handicrafts",
        "Literature & Poetry",
        "Customs & Traditions",
        "Religious Practices & Beliefs",
        "Sports & Games",
        "Architecture & Design",
        "Films & Theatre",
        "Etiquette & Social Norms",
    ];

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64Image = await convertFileToBase64(file);
                setImage(base64Image);
            } catch (error) {
                alert("Image upload failed");
            }
        }
    };

    const handleAudioUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64Audio = await convertFileToBase64(file);
                setAudio(base64Audio);
            } catch (error) {
                alert("Audio upload failed");
            }
        }
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            ...values,
            image,
            audio,
            user: user._id,
        };

        try {
            const res = await fetch("http://localhost:5000/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(postData),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Post submitted!");
                navigate("/posts");
            } else {
                alert(data.message || "Failed to submit post");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("An error occured while submitting the post");
        }
    };

    return (
        <>
            <Navbar />
            <div className="add-post-container">
                <form className="add-post-form" onSubmit={handleSubmit}>
                    <label>Select a Category</label>
                    <select name="category" value={values.category} onChange={handleChange} required>
                        <option value="" disabled>Select a category</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={values.title}
                        onChange={handleChange}
                        required
                    />

                    <label>Content</label>
                    <textarea
                        name="content"
                        rows="10"
                        value={values.content}
                        onChange={handleChange}
                        required
                    />

                    <label>Upload Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    {image && (
                        <div className="image-preview">
                            <img src={image} alt="Preview" className="preview-img" />
                        </div>
                    )}

                    <label>Upload Audio (optional)</label>
                    <input type="file" accept="audio/*" onChange={handleAudioUpload} />

                    <label>Author: {user.username}</label>

                    <div className="button-container">
                        <button type="submit" className="submit-button">Post</button>
                        <button type="button" className="cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddPost;