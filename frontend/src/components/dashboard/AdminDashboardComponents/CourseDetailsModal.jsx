import React, { useState, useEffect } from "react";
import "./DetailsModal.scss";
import * as enrollmentService from "../../../services/enrollmentService";

const CourseDetailsModal = ({ show, onClose, courseDetails }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show && courseDetails) {
      fetchEnrollments();
    }
  }, [show, courseDetails]);

  const fetchEnrollments = async () => {
    if (!courseDetails) return;

    try {
      setIsLoading(true);
      const data = await enrollmentService.getEnrollmentsByCourseId(
        courseDetails.courseId
      );
      setEnrollments(data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  if (!courseDetails) {
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

  // 計算狀態數量
  const statusCounts = enrollments.reduce((acc, enrollment) => {
    acc[enrollment.statusName] = (acc[enrollment.statusName] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="modal-overlay">
      <div className="details-modal">
        <div className="details-header">
          <div className="header-content">
            <div className="header-icon">
              <i className="bi bi-book"></i>
            </div>
            <div className="header-text">
              <h4>{courseDetails.courseName}</h4>
              <p>課程詳細資訊與報名狀態</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="details-body">
          {/* 課程基本資訊卡片 */}
          <div className="code-info-card">
            <div className="card-header">
              <h5>
                <i className="bi bi-info-circle me-2"></i>
                基本資訊
              </h5>
            </div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-hash"></i>
                  </div>
                  <div className="info-content">
                    <div className="info-label">課程 ID</div>
                    <div className="info-value">{courseDetails.courseId}</div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-file-text"></i>
                  </div>
                  <div className="info-content">
                    <div className="info-label">課程描述</div>
                    <div className="info-value">
                      {courseDetails.description || "無描述"}
                    </div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-award"></i>
                  </div>
                  <div className="info-content">
                    <div className="info-label">學分</div>
                    <div className="info-value">{courseDetails.credits}</div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-person-video3"></i>
                  </div>
                  <div className="info-content">
                    <div className="info-label">授課教師</div>
                    <div className="info-value">
                      {courseDetails.teacherName || "未指定教師"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="status-section">
                <div className="status-badges">
                  <div
                    className={`status-badge ${
                      courseDetails.isEnrollable ? "active" : "inactive"
                    }`}
                  >
                    <i
                      className={`bi ${
                        courseDetails.isEnrollable
                          ? "bi-toggle-on"
                          : "bi-toggle-off"
                      }`}
                    ></i>
                    {courseDetails.isEnrollable ? "可報名" : "不可報名"}
                  </div>

                  <div className="status-badge capacity">
                    <i className="bi bi-people-fill"></i>
                    {courseDetails.maxStudent
                      ? `${enrollments.length}/${
                          courseDetails.maxStudent
                        } (${Math.round(
                          (enrollments.length / courseDetails.maxStudent) * 100
                        )}%)`
                      : `${enrollments.length} 人 (不限制)`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 報名狀態統計卡片 */}
          <div className="usage-card">
            <div className="card-header">
              <h5>
                <i className="bi bi-bar-chart-fill me-2"></i>
                報名狀態統計
              </h5>
            </div>
            <div className="card-body">
              <div className="stats-summary">
                {Object.entries(statusCounts).map(([status, count], index) => (
                  <div key={index} className="stat-pill">
                    <span
                      className={`status-dot ${status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    ></span>
                    <span className="status-name">{status}</span>
                    <span className="status-count">{count}</span>
                  </div>
                ))}

                {Object.keys(statusCounts).length === 0 && (
                  <div className="empty-stats">尚無報名記錄</div>
                )}
              </div>
            </div>
          </div>

          {/* 學生報名列表卡片 */}
          <div className="usage-card">
            <div className="card-header">
              <h5>
                <i className="bi bi-list-check me-2"></i>
                報名學生列表
                <span className="record-count">({enrollments.length})</span>
              </h5>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>載入報名資料中...</p>
                </div>
              ) : enrollments.length > 0 ? (
                <div className="enrollment-list">
                  {enrollments.map((enrollment) => (
                    <div
                      key={enrollment.enroollmentId}
                      className="enrollment-item"
                    >
                      <div className="enrollment-avatar">
                        <i className="bi bi-person-circle"></i>
                      </div>
                      <div className="enrollment-content">
                        <div className="enrollment-header">
                          <span className="student-name">
                            {enrollment.fullName}
                          </span>
                          <span
                            className={`enrollment-status ${enrollment.statusName
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {enrollment.statusName}
                          </span>
                        </div>
                        <div className="enrollment-details">
                          <div className="enrollment-time">
                            <i className="bi bi-calendar-event me-1"></i>
                            報名時間:{" "}
                            {new Date(enrollment.enrollmentDate).toLocaleString(
                              "zh-TW"
                            )}
                          </div>
                          {enrollment.grade && (
                            <div className="enrollment-grade">
                              <i className="bi bi-mortarboard me-1"></i>
                              成績: {enrollment.grade}
                            </div>
                          )}
                        </div>
                        {enrollment.comments && (
                          <div className="enrollment-comments">
                            <i className="bi bi-chat-left-text me-1"></i>
                            {enrollment.comments}
                          </div>
                        )}
                        <div className="enrollment-update">
                          <i className="bi bi-clock-history me-1"></i>
                          最後更新:{" "}
                          {new Date(enrollment.updatedDate).toLocaleString(
                            "zh-TW"
                          )}
                        </div>
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
                    <h6>尚無學生報名</h6>
                    <p>這門課程目前沒有任何學生報名</p>
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

export default CourseDetailsModal;
