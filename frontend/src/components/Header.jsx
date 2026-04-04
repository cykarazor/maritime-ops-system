import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={headerStyle}>
      <h1>Maritime Operations System</h1>
      <nav>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/voyages" style={linkStyle}>Voyages</Link>
        <Link to="/customers" style={linkStyle}>Customers</Link>
        <Link to="/agents" style={linkStyle}>Agents</Link>
        <Link to="/cargo" style={linkStyle}>Cargo</Link>
        <Link to="/invoices" style={linkStyle}>Invoices</Link>
        <Link to="/suppliers" style={linkStyle}>Suppliers</Link>
      </nav>
    </header>
  );
};

const headerStyle = {
  padding: "10px 20px",
  backgroundColor: "#0077b6",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const linkStyle = {
  marginLeft: "15px",
  color: "white",
  textDecoration: "none",
};

export default Header;