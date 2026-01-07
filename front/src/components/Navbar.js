import React, {useContext} from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/unity.png";
import "../assets/css/Navbar.css";
import UserContext from "../contexts/UserContext";

const Navbar = () => {
    const { user } = useContext(UserContext);

    return (
        <div className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-brand-container">
                        <img src={Logo} alt="logo" className="navbar-logo" />
                        <span>AfriCulture</span>
                    </div>
                </Link>
            </div>

            <div className="navbar-right">
                <Link to="/about" className="navbar-link">About</Link>
                {user ? (
                    <>
                        <Link to="/homepage" className="navbar-link">Homepage</Link>
                        <Link to="/profile" className="navbar-link">{user.username}</Link>
                        <Link to="/logout" className="navbar-link">Logout</Link>
                    </>
                ) : (
                    <>
                        <Link to="/register" className="navbar-link">Register</Link>
                        <Link to="/login" className="navbar-link">Login</Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Navbar;