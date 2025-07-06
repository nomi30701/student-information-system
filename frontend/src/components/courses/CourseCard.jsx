import React from "react";
import "./CourseCard.scss";

const CourseCard = ({
  course,
  onEnroll,
  isEnrolled,
  studentEnrollmentStatus,
}) => {
  const hasLimit = course.maxStudent && course.maxStudent > 0;
  const isFull = hasLimit && course.enrolledCount >= course.maxStudent;
  const isEnrollable = course.isEnrollable;

  // 將 statusId 轉換為 status 字串 (如果傳入的是 statusId)
  const getStatusFromId = (statusId) => {
    const statusMap = {
      1: "Enrolled",
      2: "Withdrawn",
      3: "Completed",
    };
    return statusMap[statusId] || statusId; // 如果已經是字串就直接返回
  };

  // 處理可能是 statusId 或 status 字串的情況
  const normalizedStatus =
    typeof studentEnrollmentStatus === "number"
      ? getStatusFromId(studentEnrollmentStatus)
      : studentEnrollmentStatus;

  // 獲取報名狀態文字和樣式
  const getStatusInfo = () => {
    if (!normalizedStatus) return null;

    switch (normalizedStatus) {
      case "Enrolled":
        return { text: "已報名", className: "status-enrolled" };
      case "Withdrawn":
        return { text: "已退選", className: "status-withdrawn" };
      case "Completed":
        return { text: "已完成", className: "status-completed" };
      default:
        return null;
    }
  };

  // 判斷按鈕狀態和文字
  const getButtonInfo = () => {
    if (normalizedStatus === "Completed") {
      return {
        text: "已完成課程",
        className: "btn-outline-secondary",
        disabled: true,
        icon: "bi-check-circle",
      };
    }

    if (isEnrolled) {
      return {
        text: "取消報名",
        className: "btn-outline-danger",
        disabled: false,
        icon: "bi-x-circle",
      };
    }

    if (!isEnrollable) {
      return {
        text: "不可報名",
        className: "btn-secondary",
        disabled: true,
        icon: "bi-lock",
      };
    }

    if (isFull) {
      return {
        text: "課程已滿",
        className: "btn-secondary",
        disabled: true,
        icon: "bi-people-fill",
      };
    }

    if (normalizedStatus === "Withdrawn") {
      return {
        text: "重新報名",
        className: "btn-outline-primary",
        disabled: false,
        icon: "bi-arrow-repeat",
      };
    }

    return {
      text: "報名課程",
      className: "btn-primary",
      disabled: false,
      icon: "bi-plus-circle",
    };
  };

  // 獲取進度條顏色
  const getProgressBarClass = () => {
    if (!hasLimit) return "";
    const percentage = (course.enrolledCount / course.maxStudent) * 100;
    return percentage >= 90 ? "bg-danger" : "";
  };

  // 動態設定卡片 CSS 類
  const getCardClasses = () => {
    let classes = "card mb-3 course-card";
    if (!isEnrollable) classes += " not-enrollable";
    if (isFull) classes += " course-full";
    return classes;
  };

  const statusInfo = getStatusInfo();
  const buttonInfo = getButtonInfo();

  return (
    <div className={getCardClasses()}>
      <div className="card-body">
        <h5 className="card-title course-title">{course.courseName}</h5>
        <p className="card-text">{course.description}</p>

        <div className="course-details">
          <div className="card-text">
            <strong>學分:</strong>
            <span className="value">
              <i className="bi bi-award me-1"></i>
              {course.credits}
            </span>
          </div>

          <div className="card-text">
            <strong>教師:</strong>
            <span className="value">
              <i className="bi bi-person-check me-1"></i>
              {course.teacherName || "未指定教師"}
            </span>
          </div>

          <div className="card-text">
            <strong>開放:</strong>
            <span className="value">
              <span
                className={`enrollment-status ${
                  isEnrollable ? "open" : "closed"
                }`}
              >
                {isEnrollable ? "是" : "否"}
              </span>
            </span>
          </div>

          {course.enrolledCount !== undefined && (
            <div className="card-text enrollment-count">
              <strong>人數:</strong>
              <span className="value">
                <i className="bi bi-people me-1"></i>
                <span className={isFull ? "text-danger" : ""}>
                  {course.enrolledCount}
                  {hasLimit ? ` / ${course.maxStudent}` : " (無限制)"}
                </span>
              </span>
            </div>
          )}

          {/* 顯示學生報名狀態 */}
          {statusInfo && (
            <div className="card-text">
              <strong>狀態:</strong>
              <span className="value">
                <span className={`status-badge ${statusInfo.className}`}>
                  {statusInfo.text}
                </span>
              </span>
            </div>
          )}

          {/* 進度條 */}
          {course.enrolledCount !== undefined && hasLimit && (
            <div className="enrollment-progress">
              <div className="progress">
                <div
                  className={`progress-bar ${getProgressBarClass()}`}
                  role="progressbar"
                  style={{
                    width: `${Math.min(
                      (course.enrolledCount / course.maxStudent) * 100,
                      100
                    )}%`,
                  }}
                  aria-valuenow={course.enrolledCount}
                  aria-valuemin="0"
                  aria-valuemax={course.maxStudent}
                ></div>
              </div>
              <small className="text-muted">
                報名進度:{" "}
                {Math.round((course.enrolledCount / course.maxStudent) * 100)}%
              </small>
            </div>
          )}
        </div>

        <button
          className={`btn ${buttonInfo.className} w-100`}
          onClick={() => onEnroll(course.courseId, isEnrolled)}
          disabled={buttonInfo.disabled}
        >
          <i className={`${buttonInfo.icon} me-2`}></i>
          {buttonInfo.text}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
