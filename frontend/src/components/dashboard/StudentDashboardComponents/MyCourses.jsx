import React, { useState, useEffect } from "react";
import { getEnrollmentByStudentId } from "../../../services/enrollmentService";
import StudentEnrollmentCard from "../StudentDashboardComponents/StudentEnrollmentCard";
import "./MyCourses.scss";

const MyCourses = ({ courses, studentId, onEnroll, refreshTrigger = 0 }) => {
  const [allEnrollments, setAllEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    Enrolled: 0,
    Withdrawn: 0,
    Completed: 0,
  });

  const statusOptions = [
    { value: "", label: "全部狀態", icon: "bi-list", color: "primary" },
    {
      value: "Enrolled",
      label: "已報名",
      icon: "bi-journal-plus",
      color: "success",
    },
    {
      value: "Withdrawn",
      label: "已退選",
      icon: "bi-x-circle",
      color: "warning",
    },
    {
      value: "Completed",
      label: "已完成",
      icon: "bi-check-circle",
      color: "info",
    },
  ];

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 3000);
  };

  // 計算狀態統計
  const calculateStatusCounts = (enrollments) => {
    const counts = {
      all: enrollments.length,
      Enrolled: 0,
      Withdrawn: 0,
      Completed: 0,
    };

    enrollments.forEach((enrollment) => {
      const status = enrollment.statusName; // 直接用 statusName
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });

    return counts;
  };

  // 載入所有課程資料
  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const enrollments = await getEnrollmentByStudentId(studentId);

      setAllEnrollments(enrollments);
      setStatusCounts(calculateStatusCounts(enrollments));
    } catch (error) {
      console.error("Error fetching my courses:", error);
      showAlert("無法獲取課程資料", "error");
    } finally {
      setLoading(false);
    }
  };

  // 客戶端篩選功能
  useEffect(() => {
    let filtered = allEnrollments;

    // 狀態篩選
    if (selectedStatus) {
      filtered = filtered.filter(
        (enrollment) => enrollment.statusName === selectedStatus
      );
    }

    // 搜尋篩選
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (enrollment) =>
          enrollment.courseName?.toLowerCase().includes(searchLower) ||
          enrollment.description?.toLowerCase().includes(searchLower) ||
          (enrollment.teacherName &&
            enrollment.teacherName.toLowerCase().includes(searchLower))
      );
    }

    // 按報名時間排序 (最新在前)
    filtered.sort(
      (a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate)
    );

    setFilteredEnrollments(filtered);
  }, [allEnrollments, selectedStatus, searchTerm]);

  useEffect(() => {
    if (studentId) {
      fetchMyCourses();
    }
  }, [studentId, refreshTrigger]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSelectedStatus("");
    setSearchTerm("");
  };

  const handleEnrollAction = async (courseId, isEnrolled) => {
    await onEnroll(courseId, isEnrolled);
    // 重新載入資料
    fetchMyCourses();
  };

  // 取得當前狀態的選項資訊
  const getCurrentStatusInfo = () => {
    return (
      statusOptions.find((option) => option.value === selectedStatus) ||
      statusOptions[0]
    );
  };

  return (
    <div className="my-courses">
      {alert.show && (
        <div className={`alert alert-${alert.type}`}>
          <i
            className={`bi ${
              alert.type === "success"
                ? "bi-check-circle"
                : "bi-exclamation-triangle"
            } me-2`}
          ></i>
          {alert.message}
        </div>
      )}

      <div className="courses-header">
        <div className="header-title">
          <h3>
            <i className="bi bi-journal-check me-2"></i>
            我的課程
          </h3>
          <span className="course-count">
            共 {statusCounts.all} 門課程
            {(selectedStatus || searchTerm) && (
              <span className="filtered-count">
                (顯示 {filteredEnrollments.length} 門)
              </span>
            )}
          </span>
        </div>
      </div>

      {/* 搜尋欄 */}
      <div className="search-container mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="搜尋課程名稱、描述或教師..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setSearchTerm("")}
            >
              <i className="bi bi-x-circle"></i>
            </button>
          )}
        </div>
      </div>

      {/* 狀態篩選 */}
      <div className="status-filters mb-4">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            className={`btn btn-outline-${option.color} btn-sm ${
              selectedStatus === option.value ? "active" : ""
            }`}
            onClick={() => handleStatusChange(option.value)}
          >
            <i className={`${option.icon} me-1`}></i>
            {option.label}
            <span className="count-badge">
              {option.value === ""
                ? statusCounts.all
                : statusCounts[option.value] || 0}
            </span>
          </button>
        ))}

        {/* 清除所有篩選 */}
        {(selectedStatus || searchTerm) && (
          <button
            className="btn btn-outline-secondary btn-sm ms-2"
            onClick={clearFilters}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            清除篩選
          </button>
        )}
      </div>

      {/* 當前篩選狀態顯示 */}
      {(selectedStatus || searchTerm) && (
        <div className="current-filter mb-3">
          <div className="filter-info">
            {selectedStatus && (
              <span className="filter-tag">
                <i className={`${getCurrentStatusInfo().icon} me-1`}></i>
                狀態: {getCurrentStatusInfo().label}
              </span>
            )}
            {searchTerm && (
              <span className="filter-tag">
                <i className="bi bi-search me-1"></i>
                搜尋: "{searchTerm}"
              </span>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">載入課程資料中...</p>
        </div>
      ) : (
        <div className="courses-container">
          <div className="row">
            {filteredEnrollments.length > 0 ? (
              filteredEnrollments.map((enrollment) => {
                const course = courses.find(
                  (c) => c.courseId === enrollment.courseId
                );
                return (
                  <div
                    key={enrollment.enrollmentId}
                    className="col-lg-4 col-md-6 mb-4"
                  >
                    <StudentEnrollmentCard
                      course={course}
                      enrollment={enrollment}
                      onEnroll={handleEnrollAction}
                    />
                  </div>
                );
              })
            ) : (
              <div className="col-12">
                <div className="no-courses">
                  <div className="icon-wrapper">
                    <i className="bi bi-journal-x"></i>
                  </div>
                  <h4>沒有找到課程</h4>
                  <p>
                    {allEnrollments.length === 0
                      ? "您還沒有報名任何課程"
                      : selectedStatus || searchTerm
                      ? "沒有符合篩選條件的課程"
                      : "沒有找到課程"}
                  </p>
                  {(selectedStatus || searchTerm) && (
                    <button
                      className="btn btn-outline-primary"
                      onClick={clearFilters}
                    >
                      <i className="bi bi-arrow-left me-1"></i>
                      查看全部課程
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 結果統計 */}
      {!loading && filteredEnrollments.length > 0 && (
        <div className="results-summary mt-4">
          <div className="summary-card">
            <i className="bi bi-info-circle me-2"></i>
            顯示 <strong>{filteredEnrollments.length}</strong> /{" "}
            <strong>{statusCounts.all}</strong> 門課程
            {(selectedStatus || searchTerm) && (
              <span className="ms-2 text-muted">(已套用篩選條件)</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
