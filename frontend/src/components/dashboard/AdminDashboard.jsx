import React, { useEffect, useState } from "react";
import * as roleService from "../../services/roleService";
import "./AdminDashboard.scss";

import UserManagement from "./AdminDashboardTabs/UserManagement";
import CourseManagement from "./AdminDashboardTabs/CourseManagement";
import InvitationCodeManagement from "./AdminDashboardTabs/InvitationCodeManagement";
import Statistics from "./AdminDashboardTabs/Statistics";

const AdminDashboard = () => {
  const [roles, setRoles] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await roleService.getRoles();
      setRoles(response);
    } catch (error) {
      console.error("Error fetching roles:", error);
      showAlert("無法獲取角色資訊", "error");
    }
  };

  // 顯示提示訊息
  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ ...alert, show: false });
    }, 3000);
  };

  // 標籤切換
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="admin-dashboard">
      <h2>管理員儀表板</h2>

      {alert.show && (
        <div className={`alert alert-${alert.type}`}>{alert.message}</div>
      )}

      <div className="tab-container">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => handleTabChange("users")}
          >
            用戶管理
          </button>
          <button
            className={`tab-btn ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => handleTabChange("courses")}
          >
            課程管理
          </button>
          <button
            className={`tab-btn ${activeTab === "invitations" ? "active" : ""}`}
            onClick={() => handleTabChange("invitations")}
          >
            邀請碼管理
          </button>
          <button
            className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => handleTabChange("stats")}
          >
            統計報表
          </button>
        </div>

        <div className="tab-content">
          {/* 用戶管理 */}
          {activeTab === "users" && (
            <UserManagement roles={roles} showAlert={showAlert} />
          )}

          {/* 課程管理 */}
          {activeTab === "courses" && (
            <CourseManagement showAlert={showAlert} />
          )}

          {/* 邀請碼管理 */}
          {activeTab === "invitations" && (
            <InvitationCodeManagement roles={roles} showAlert={showAlert} />
          )}

          {/* 統計報表 */}
          {activeTab === "stats" && <Statistics />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
