import React, { useEffect, useState } from "react";
import * as userService from "../../../services/userService";
import UserModal from "../AdminDashboardComponents/UserModal";

const UserManagement = ({ roles, showAlert }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 資料分頁
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);

  // 搜尋和篩選
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");

  // 用戶模態框狀態
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    username: null,
    password: null,
    roleId: null,
    firstName: null,
    lastName: null,
    email: null,
    dateOfBirth: null,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // 添加搜尋延遲效果
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [userSearchTerm, userRoleFilter, currentUserPage]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUsers({
        page: currentUserPage,
        pageSize: itemsPerPage,
        search: userSearchTerm,
        roleId: userRoleFilter,
      });
      setUsers(response.users);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
      showAlert("無法獲取用戶資料", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 獲取角色名稱
  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.roleId === roleId);
    return role ? role.roleName : "未知角色";
  };

  // 用戶表單處理
  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // 編輯用戶
  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserFormData({
      username: user.username,
      password: null, // 密碼欄位不回填
      roleId: user.roleId,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      email: user.email || null,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : null,
    });
    setShowUserModal(true);
  };

  // 刪除用戶
  const handleDeleteUser = async (userId) => {
    if (window.confirm("確定要刪除此用戶嗎？")) {
      try {
        await userService.deleteUser(userId);
        fetchUsers(); // 重新獲取用戶列表
        showAlert("用戶已成功刪除", "success");
      } catch (error) {
        console.error("Error deleting user:", error);
        showAlert("刪除用戶時發生錯誤", "error");
      }
    }
  };

  // 修改搜尋處理函數
  const handleUserSearch = (e) => {
    setUserSearchTerm(e.target.value);
    setCurrentUserPage(1); // 重置到第一頁
  };

  // 修改角色過濾處理
  const handleRoleFilter = (e) => {
    setUserRoleFilter(e.target.value);
    setCurrentUserPage(1); // 重置到第一頁
  };

  // 修改分頁處理
  const handleUserPageChange = (pageNumber) => {
    setCurrentUserPage(pageNumber);
  };

  // 提交用戶表單
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      userFormData.roleId = userFormData.roleId
        ? parseInt(userFormData.roleId, 10)
        : null;
      if (editingUser) {
        // 更新現有用戶
        await userService.updateUser(editingUser.userId, userFormData);
        showAlert("用戶已成功更新", "success");
      } else {
        // 新增用戶
        await userService.createUser(userFormData);
        showAlert("用戶已成功創建", "success");
      }
      setShowUserModal(false);
      fetchUsers();
      resetUserForm();
    } catch (error) {
      console.error("Error saving user:", error);
      showAlert("保存用戶時發生錯誤", "error");
    }
  };

  // 重置用戶表單
  const resetUserForm = () => {
    setEditingUser(null);
    setUserFormData({
      username: null,
      password: null,
      roleId: null,
      firstName: null,
      lastName: null,
      email: null,
      dateOfBirth: null,
    });
  };

  return (
    <div className="tab-pane">
      <div className="header-actions">
        <h3>用戶管理</h3>
        <button
          className="btn btn-primary"
          onClick={() => setShowUserModal(true)}
        >
          <i className="bi bi-plus-circle"></i> 新增用戶
        </button>
      </div>

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="搜尋用戶..."
                value={userSearchTerm}
                onChange={handleUserSearch}
              />
            </div>
            <div className="filter-box">
              <select value={userRoleFilter} onChange={handleRoleFilter}>
                <option value="">所有角色</option>
                {roles.map((role) => (
                  <option key={role.roleId} value={role.roleId}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>用戶名</th>
                <th>姓名</th>
                <th>電子郵件</th>
                <th>角色</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId}>
                  <td>{user.username}</td>
                  <td>{`${user.firstName || ""} ${user.lastName || ""}`}</td>
                  <td>{user.email}</td>
                  <td>{getRoleName(user.roleId)}</td>
                  <td className="actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEditUser(user)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteUser(user.userId)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 用戶分頁控制 */}
          <div className="pagination">
            {Array.from({
              length: totalPages,
            }).map((_, index) => (
              <button
                key={index}
                className={`page-btn ${
                  currentUserPage === index + 1 ? "active" : ""
                }`}
                onClick={() => handleUserPageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}

      <UserModal
        show={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          resetUserForm();
        }}
        currentUser={editingUser}
        formData={userFormData}
        onChange={handleUserFormChange}
        onSubmit={handleUserSubmit}
        roles={roles}
      />
    </div>
  );
};

export default UserManagement;
