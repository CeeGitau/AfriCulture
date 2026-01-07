import React from "react";
import Navbar from "../components/Navbar";
import "../assets/css/about.css";

const About = () => {
    return (
        <div>
            <Navbar />
            <div className="about-container">
                <div className="about-content">
                    <h1 className="about-title">About AfriCulture</h1>
                    <p className="about-description">
                        AfriCulture is a living archive and celebration of the rich, diverse cultures across the African continent. From traditional music and clothing to food, language, and customs. AfriCulture gives people the opportunity to share their heritage with the world.
                    </p>

                    <p className="about-description">
                        In an era of globalization, it's easy for indigenous traditions to fade. AfriCulture exists to ensure that the stories, practices, and identities that shape African communities are preserved and passed down to future generations, not just as memories, but as part of our daily conversations.
                    </p>

                    <p className="about-description">
                        Whether you’re from Africa or simply passionate about learning, this space is open to everyone. Through photos, stories, and shared experiences, we aim to create a digital village where people connect, learn, and celebrate Africa’s vibrant heritage.
                    </p>

                    <p className="about-description">
                        Join us in preserving the past, embracing the present, and inspiring the future, one post at a time.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
