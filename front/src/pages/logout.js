import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserContext from "../contexts/UserContext";
import "../assets/css/logout.css";

const Logout = () => {
    const [showPrompt, setShowPrompt] = useState(true);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);

        toast.success("Logout successful");
        navigate("/login");
    }

    const cancelLogout = () => {
        setShowPrompt(false);
        toast.info("Logout cancelled");
        navigate("/homepage");
    }

    return (
        <div className="logout-container">
            {showPrompt && (
                <div className="logout-prompt">
                    <h2>Are you sure you want to logout?</h2>
                    <div className="logout-buttons">
                        <button className="btn-logout" onClick={handleLogout}>Yes</button>
                        <button className="btn-cancel" onClick={cancelLogout}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Logout;