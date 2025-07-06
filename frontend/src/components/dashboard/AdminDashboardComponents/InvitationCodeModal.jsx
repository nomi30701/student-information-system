import React from "react";
import "./Modals.scss";

const InvitationCodeModal = ({
  show,
  onClose,
  currentCode,
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
          <h4>{currentCode ? "編輯邀請碼" : "生成邀請碼"}</h4>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            {currentCode && (
              <div className="form-group">
                <label>邀請碼</label>
                <input
                  type="text"
                  value={currentCode.code}
                  readOnly
                  className="readonly-input"
                />
              </div>
            )}

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

            <div className="form-group">
              <label>過期日期</label>
              <input
                type="datetime-local"
                name="expirationDate"
                value={formData.expirationDate || null}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      onChange({
                        target: {
                          name: "isActive",
                          value: e.target.checked,
                        },
                      })
                    }
                  />
                  啟用狀態
                </label>
              </div>
            </div>

            {currentCode && (
              <div className="info-section">
                <div className="info-item">
                  <span className="label">創建者：</span>
                  <span className="value">{currentCode.creatorUsername}</span>
                </div>
                <div className="info-item">
                  <span className="label">創建時間：</span>
                  <span className="value">
                    {new Date(currentCode.creationDate).toLocaleString("zh-TW")}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">使用狀態：</span>
                  <span
                    className={`status ${
                      currentCode.isUsed ? "used" : "unused"
                    }`}
                  >
                    {currentCode.isUsed ? "已使用" : "未使用"}
                  </span>
                </div>
              </div>
            )}
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
              {currentCode ? "更新" : "生成"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvitationCodeModal;
