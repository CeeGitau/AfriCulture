import React from "react";

// helper function to generate a color from string
const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += ("00" + value.toString(16)).slice(-2);
    }
    return color;
};

const CommunityLabel = ({ community }) => {
    const bgColor = stringToColor(community);

    const style = {
        backgroundColor: bgColor,
        color: "#fff",
        padding: "2px 8px",
        borderRadius: "12px",
        fontSize: "0.85rem",
        display: "inline-block",
        width: "fit-content", 
        whiteSpace: "nowrap",
    };

    return <span style={style}>{community}</span>;
};

export default CommunityLabel;
