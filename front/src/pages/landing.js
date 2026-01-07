import React from "react";
import Navbar from "../components/Navbar";
import Logo from "../assets/images/unity.png";
import "../assets/css/landing.css";

const Landing = () => {
    return (
        <div>
            <Navbar />
            <div className="landing-container">
                <img src={Logo} alt="logo" className="landing-logo" />
                <h1 className="landing-title">Welcome to AfriCulture 🌍✨</h1>
                <p className="landing-description">Explore and share the beauty of African culture.</p>
            </div>
        </div>
    );
};

export default Landing;