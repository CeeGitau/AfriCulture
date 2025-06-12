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

const categoryIcons = {
    "Food & Cuisine": require("../assets/images/food and cuisine.png"),
    "Clothing & Fashion": require("../assets/images/clothing and fashion.png"),
    "Music & Dance": require("../assets/images/music and dance.png"),
    "Languages & Culture": require("../assets/images/language and culture.png"),
    "Festivals & Holidays": require("../assets/images/festivals and holidays.png"),
    "Arts & Handicrafts": require("../assets/images/arts and handicrafts.png"),
    "Literature & Poetry": require("../assets/images/literature and poetry.png"),
    "Customs & Traditions": require("../assets/images/customs and traditions.png"),
    "Religious Practices & Beliefs": require("../assets/images/religious practices and beliefs.png"),
    "Sports & Games": require("../assets/images/sports and games.png"),
    "Architecture & Design": require("../assets/images/architecture and design.png"),
    "Films & Theatre": require("../assets/images/film and theatre.png"),
    "Etiquette & Social Norms": require("../assets/images/etiquette and social norms.png"),
};

const Homepage = () => {
    return (
        <div>
            <Navbar />
            <div className="homepage-container">
                <div className="conversation-buttons">
                    <Link to="/add-post" className="post-link">Add a post</Link>
                    <Link to="/all-posts" className="post-link">View posts</Link>
                </div>

                <div className="homepage-content">
                    <h2 className="homepage-heading">Explore African Culture</h2>
                    <p className="homepage-subtext">Select a category to dive into its rich heritage:</p>
                    <ul className="categories-list">
                        {categories.map((category, index) => (
                            <li key={index} className="category-item">
                                <Link
                                    to={`/category/${encodeURIComponent(category)}`}
                                    className="category-link"
                                >
                                    <img src={categoryIcons[category]} alt={category} className="category-icon" />
                                    {category}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default Homepage;