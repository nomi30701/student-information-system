import React from "react";
import "./StudentEnrollmentCard.scss";

const StudentEnrollmentCard = ({ course, enrollment, onEnroll }) => {
  const { statusName, enrollmentDate, grade, comments } = enrollment;

  const getStatusInfo = (status) => {
    const statusMap = {
      Enrolled: {
        text: "已報名",
        className: "status-enrolled",
        icon: "bi-check-circle",
        color: "success",
      },
      Withdrawn: {
        text: "已退選",
        className: "status-withdrawn",
        icon: "bi-x-circle",
        color: "warning",
      },
      Completed: {
        text: "已完成",
        className: "status-completed",
        icon: "bi-award",
        color: "info",
      },
    };
    return (
      statusMap[status] || {
        text: status,
        className: "status-default",
        icon: "bi-question-circle",
        color: "secondary",
      }
    );
  };

  const getButtonInfo = () => {
    switch (statusName) {
      case "Enrolled":
        return {
          text: "取消報名",
          className: "btn-outline-danger",
          disabled: false,
          icon: "bi-x-circle",
          action: () => onEnroll && onEnroll(course.courseId, true),
        };
      case "Withdrawn":
        return {
          text: "重新報名",
          className: "btn-outline-primary",
          disabled:
            !course.isEnrollable ||
            (course.maxStudent && course.enrolledCount >= course.maxStudent),
          icon: "bi-arrow-repeat",
          action: () => onEnroll && onEnroll(course.courseId, false),
        };
      case "Completed":
        return {
          text: "已完成課程",
          className: "btn-outline-success",
          disabled: true,
          icon: "bi-check-circle",
          action: null,
        };
      default:
        return {
          text: "未知狀態",
          className: "btn-secondary",
          disabled: true,
          icon: "bi-question-circle",
          action: null,
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const statusInfo = getStatusInfo(statusName);
  const buttonInfo = getButtonInfo();

  return (
    <div className={`student-enrollment-card ${statusInfo.className}`}>
      {/* 狀態標籤 */}
      <div className="status-badge-top">
        <span className={`status-badge ${statusInfo.className}`}>
          <i className={`${statusInfo.icon} me-1`}></i>
          {statusInfo.text}
        </span>
        {grade && (
          <span className="grade-badge">
            <i className="bi bi-mortarboard me-1"></i>
            {grade}
          </span>
        )}
      </div>

      <div className="card-body">
        {/* 課程基本資訊 */}
        <h5 className="course-title">{course.courseName}</h5>
        <p className="course-description">{course.description}</p>

        <div className="course-details">
          <div className="detail-item">
            <i className="bi bi-award me-2"></i>
            <strong>學分:</strong> {course.credits}
          </div>

          <div className="detail-item">
            <i className="bi bi-person-check me-2"></i>
            <strong>教師:</strong> {course.teacherName || "未指定教師"}
          </div>

          <div className="detail-item">
            <i className="bi bi-people me-2"></i>
            <strong>人數:</strong>
            {course.enrolledCount || 0}
            {course.maxStudent ? ` / ${course.maxStudent}` : " (無限制)"}
          </div>

          <div className="detail-item">
            <i className="bi bi-calendar-event me-2"></i>
            <strong>報名時間:</strong> {formatDate(enrollmentDate)}
          </div>

          {/* 開放報名狀態 */}
          <div className="detail-item">
            <i className="bi bi-toggle-on me-2"></i>
            <strong>開放報名:</strong>
            <span
              className={`enrollment-status ${
                course.isEnrollable ? "open" : "closed"
              }`}
            >
              {course.isEnrollable ? "是" : "否"}
            </span>
          </div>
        </div>

        {/* 備註 */}
        {comments && (
          <div className="comments-section">
            <div className="comments-header">
              <i className="bi bi-chat-text me-2"></i>
              <strong>備註:</strong>
            </div>
            <p className="comments-text">{comments}</p>
          </div>
        )}

        {/* 進度條 (只有已報名狀態顯示) */}
        {statusName === "Enrolled" && course.maxStudent && (
          <div className="enrollment-progress">
            <div className="progress-header">
              <span>報名進度</span>
              <span>
                {Math.round((course.enrolledCount / course.maxStudent) * 100)}%
              </span>
            </div>
            <div className="progress">
              <div
                className="progress-bar"
                style={{
                  width: `${Math.min(
                    (course.enrolledCount / course.maxStudent) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {/* 操作按鈕 */}
        <button
          className={`btn ${buttonInfo.className} w-100 mt-3`}
          onClick={buttonInfo.action}
          disabled={buttonInfo.disabled}
        >
          <i className={`${buttonInfo.icon} me-2`}></i>
          {buttonInfo.text}
        </button>
      </div>
    </div>
  );
};

export default StudentEnrollmentCard;
