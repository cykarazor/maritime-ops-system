import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: "100vh", paddingBottom: "40px" /* space for footer */ }}>
      <Header />
      <main style={{ padding: "20px" }}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;