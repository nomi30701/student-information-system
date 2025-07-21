import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Navbar.scss";

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsExpanded(false);
      setIsDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const closeNavbar = () => {
    setIsExpanded(false);
    setIsDropdownOpen(false);
  };

  // 點擊外部時關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={closeNavbar}>
          <i className="bi bi-book me-2"></i>
          Student Info System
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={isExpanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${isExpanded ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeNavbar}>
                <i className="bi bi-house-door me-1"></i> 首頁
              </Link>
            </li>

            {/* 已登入時顯示的選項 */}
            {currentUser && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/dashboard"
                    onClick={closeNavbar}
                  >
                    <i className="bi bi-speedometer2 me-1"></i> 儀表板
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/courses"
                    onClick={closeNavbar}
                  >
                    <i className="bi bi-journal-text me-1"></i> 課程
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/profile"
                    onClick={closeNavbar}
                  >
                    <i className="bi bi-person me-1"></i> 個人資料
                  </Link>
                </li>
              </>
            )}

            {/* 未登入時顯示的選項 */}
            {!currentUser && !loading && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/courses"
                    onClick={closeNavbar}
                  >
                    <i className="bi bi-journal-text me-1"></i> 課程
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={closeNavbar}>
                    <i className="bi bi-box-arrow-in-right me-1"></i> 登入
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link btn btn-outline-primary btn-sm ms-2 register-btn"
                    to="/register"
                    onClick={closeNavbar}
                  >
                    註冊
                  </Link>
                </li>
              </>
            )}

            {/* 已登入時顯示用戶信息和登出 */}
            {currentUser && (
              <li className="nav-item dropdown" ref={dropdownRef}>
                <button
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  type="button"
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {currentUser.firstName || currentUser.username}
                </button>
                <ul
                  className={`dropdown-menu dropdown-menu-end ${
                    isDropdownOpen ? "show" : ""
                  }`}
                >
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/profile"
                      onClick={closeNavbar}
                    >
                      <i className="bi bi-person me-2"></i>
                      個人資料
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                      disabled={loading}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      {loading ? "登出中..." : "登出"}
                    </button>
                  </li>
                </ul>
              </li>
            )}

            {/* 載入中顯示 */}
            {loading && (
              <li className="nav-item">
                <span className="nav-link">
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  >
                    <span className="visually-hidden">載入中...</span>
                  </div>
                  載入中...
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
