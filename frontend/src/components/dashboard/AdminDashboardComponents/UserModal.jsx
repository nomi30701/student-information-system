import React from "react";
import "./Modals.scss";

const UserModal = ({
  show,
  onClose,
  currentUser,
  formData,
  onChange,
  onSubmit,
  roles,
}) => {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h4>{currentUser ? "編輯用戶" : "新增用戶"}</h4>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>用戶名*</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label>{currentUser ? "新密碼 (留空不變)" : "密碼*"}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                required={!currentUser}
              />
            </div>

            <div className="form-group">
              <label>角色*</label>
              <select
                name="roleId"
                value={formData.roleId}
                onChange={onChange}
                required
              >
                <option value="">選擇角色</option>
                {roles.map((role) => (
                  <option key={role.roleId} value={role.roleId}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label>名字*</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="form-group half">
                <label>姓氏*</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>電子郵件*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label>出生日期</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
