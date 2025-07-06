import "./DetailsModal.scss";

const InvitationCodeDetailsModal = ({
  show,
  onClose,
  codeDetails,
  usageRecords,
}) => {
  if (!show) return null;

  if (!codeDetails) {
    return (
      <div className="modal-overlay">
        <div className="details-modal">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="details-modal">
        <div className="details-header">
          <div className="header-content">
            <div className="header-icon">
              <i className="bi bi-card-text"></i>
            </div>
            <div className="header-text">
              <h4>邀請碼詳細資訊</h4>
              <p>查看邀請碼的完整資訊與使用記錄</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="details-body">
          {/* 邀請碼基本資訊卡片 */}
          <div className="code-info-card">
            <div className="card-header">
              <h5>
                <i className="bi bi-key me-2"></i>
                基本資訊
              </h5>
            </div>
            <div className="card-body">
              <div className="code-display">
                <div className="code-label">邀請碼</div>
                <div className="code-value">{codeDetails.code}</div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-person-badge"></i>
                  </div>
                  <div className="info-content">
                    <div className="info-label">指定角色</div>
                    <div className="info-value">{codeDetails.roleName}</div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-person-check"></i>
                  </div>
                  <div className="info-content">
                    <div className="info-label">建立者</div>
                    <div className="info-value">
                      {codeDetails.creatorUsername}
                    </div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-calendar-plus"></i>
                  </div>
                  <div className="info-content">
                    <div className="info-label">建立時間</div>
                    <div className="info-value">
                      {new Date(codeDetails.creationDate).toLocaleString(
                        "zh-TW"
                      )}
                    </div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-calendar-x"></i>
                  </div>
                  <div className="info-content">
                    <div className="info-label">到期時間</div>
                    <div className="info-value">
                      {new Date(codeDetails.expirationDate).toLocaleString(
                        "zh-TW"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="status-section">
                <div className="status-badges">
                  <div
                    className={`status-badge ${
                      codeDetails.isUsed ? "used" : "unused"
                    }`}
                  >
                    <i
                      className={`bi ${
                        codeDetails.isUsed
                          ? "bi-check-circle-fill"
                          : "bi-circle"
                      }`}
                    ></i>
                    {codeDetails.isUsed ? "已使用" : "未使用"}
                  </div>
                  <div
                    className={`status-badge ${
                      codeDetails.isActive ? "active" : "inactive"
                    }`}
                  >
                    <i
                      className={`bi ${
                        codeDetails.isActive ? "bi-toggle-on" : "bi-toggle-off"
                      }`}
                    ></i>
                    {codeDetails.isActive ? "已啟用" : "已停用"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 使用紀錄卡片 */}
          <div className="usage-card">
            <div className="card-header">
              <h5>
                <i className="bi bi-clock-history me-2"></i>
                使用紀錄
                <span className="record-count">
                  ({usageRecords ? usageRecords.length : 0})
                </span>
              </h5>
            </div>
            <div className="card-body">
              {usageRecords && usageRecords.length > 0 ? (
                <div className="usage-list">
                  {usageRecords.map((record, index) => (
                    <div key={index} className="usage-item">
                      <div className="usage-avatar">
                        <i className="bi bi-person-circle"></i>
                      </div>
                      <div className="usage-content">
                        <div className="usage-header">
                          <span className="username">{record.username}</span>
                          <span className="user-id">ID: {record.userId}</span>
                        </div>
                        <div className="usage-time">
                          <i className="bi bi-clock me-1"></i>
                          {new Date(record.usageDate).toLocaleString("zh-TW", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </div>
                      </div>
                      <div className="usage-status">
                        <i className="bi bi-check-circle-fill"></i>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <i className="bi bi-inbox"></i>
                  </div>
                  <div className="empty-text">
                    <h6>尚無使用紀錄</h6>
                    <p>此邀請碼還沒有被任何用戶使用過</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="details-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            <i className="bi bi-x-circle me-2"></i>
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitationCodeDetailsModal;
