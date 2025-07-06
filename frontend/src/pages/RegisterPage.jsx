import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: null,
    password: null,
    firstName: null,
    lastName: null,
    email: null,
    dateOfBirth: null,
    roleId: null,
    invitationCode: null,
  });

  const [roles] = useState([
    { roleId: 1, roleName: "學生" },
    { roleId: 2, roleName: "教師" },
    { roleId: 3, roleName: "管理員" },
  ]);

  const [error, setError] = useState("");
  const [showInvitationField, setShowInvitationField] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
    setFormData((prev) => ({ ...prev, roleId: 1 }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "roleId") {
      setShowInvitationField(value === "2" || value === "3");

      if (!(value === "2" || value === "3")) {
        setFormData((prev) => ({ ...prev, invitationCode: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showInvitationField && !formData.invitationCode.trim()) {
      setError("教師或管理員註冊需要有效的邀請碼");
      return;
    }

    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      const backendMessage = err.response?.data?.message;

      if (backendMessage) {
        setError(`${backendMessage}，請再試一次`);
      } else {
        setError("註冊失敗，請再試一次");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>註冊帳號</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            使用者名稱
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            密碼
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            名字
          </label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            姓氏
          </label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            電子郵件
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dateOfBirth" className="form-label">
            出生日期
          </label>
          <input
            type="date"
            className="form-control"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="roleId" className="form-label">
            選擇角色
          </label>
          <select
            className="form-select"
            id="roleId"
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            required
          >
            <option value="">請選擇角色</option>
            {roles.map((role) => (
              <option key={role.roleId} value={role.roleId}>
                {role.roleName}
              </option>
            ))}
          </select>
        </div>

        {showInvitationField && (
          <div className="mb-3">
            <label htmlFor="invitationCode" className="form-label">
              邀請碼
            </label>
            <input
              type="text"
              className="form-control"
              id="invitationCode"
              name="invitationCode"
              value={formData.invitationCode}
              onChange={handleChange}
              required
              placeholder="請輸入教師/管理員註冊邀請碼"
            />
            <div className="form-text text-muted">
              教師或管理員註冊需要有效的邀請碼，請向系統管理員索取
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          註冊
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
