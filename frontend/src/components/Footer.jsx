import React from "react";

const Footer = () => {
  return (
    <footer style={footerStyle}>
      &copy; {new Date().getFullYear()} Atlantic Star Limited. All rights reserved.
    </footer>
  );
};

const footerStyle = {
  padding: "10px 20px",
  backgroundColor: "#023e8a",
  color: "white",
  textAlign: "center",
  position: "fixed",
  bottom: 0,
  width: "100%",
};

export default Footer;