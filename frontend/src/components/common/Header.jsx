import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  return (
    <header className="bg-light py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="d-flex align-items-center text-decoration-none">
          <img
            src={logo}
            alt="Logo"
            className="me-2"
            style={{ height: "40px" }}
          />
          <span className="h4">學生資訊系統</span>
        </Link>
        <nav>
          <Link to="/" className="btn btn-outline-primary me-2">
            首頁
          </Link>
          <Link to="/courses" className="btn btn-outline-primary me-2">
            課程
          </Link>
          <Link to="/profile" className="btn btn-outline-primary">
            個人資料
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
