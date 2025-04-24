import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "../assets/css/homepage.css";

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

const Homepage = () => {
    return (
        <div>
            <Navbar />
            <div className="homepage-container">
                <div className="conversation-buttons">
                    <Link to="/add-post" className="post-link">Add a post</Link>
                    <Link to="/posts" className="post-link">View posts</Link>
                </div>
                
                <h2 className="homepage-heading">Explore African Culture</h2>
                <p className="homepage-subtext">Select a category to dive into its rich heritage:</p>
                <ul className="categories-list">
                    {categories.map((category, index) => (
                        <li key={index} className="category-item">
                            <Link
                                to={`/category/${encodeURIComponent(category)}`}
                                className="category-link"
                            >
                                {category}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Homepage;