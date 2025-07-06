import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getCourses } from "../../services/courseService";
import {
  enrollCourse,
  cancelEnrollment,
  reEnroll,
} from "../../services/enrollmentService";
import CourseCard from "../courses/CourseCard";
import CreditStats from "./StudentDashboardComponents/CreditStats";
import MyCourses from "./StudentDashboardComponents/MyCourses";
import "./StudentDashboard.scss";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [activeView, setActiveView] = useState("all"); // "all" 或 "my"
  const [refreshTrigger, setRefreshTrigger] = useState(0); // 用於觸發重新載入

  const { currentUser } = useAuth();

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 3000);
  };

  // 觸發重新載入學分統計和我的課程
  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // 載入所有課程
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getCourses({
        page: currentPage,
        pageSize: 9,
        search: searchTerm,
        studentId: currentUser.userId,
      });

      setCourses(response.courses || []);
      setTotalPages(response.pagination.totalPages);

      if (!isSearching) {
        showAlert("課程資料載入成功", "success");
      }
      setIsSearching(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      showAlert("無法獲取課程資料", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === "all") {
      fetchCourses();
    }
  }, [currentPage, activeView]);

  useEffect(() => {
    if (activeView === "all") {
      const timer = setTimeout(() => {
        setCurrentPage(1);
        setIsSearching(true);
        fetchCourses();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    setIsSearching(false);
    if (activeView === "all") {
      fetchCourses();
    }
  };
  const handleEnrollAction = async (
    courseId,
    isEnrolled,
    studentEnrollmentStatusName
  ) => {
    if (!currentUser) {
      showAlert("請先登入才能報名課程", "error");
      return;
    }

    try {
      if (isEnrolled) {
        await cancelEnrollment(currentUser.userId, courseId);
        showAlert(`已取消報名課程`, "success");
      } else if (studentEnrollmentStatusName === "Withdrawn") {
        await reEnroll(currentUser.userId, courseId);
        showAlert(`已重新報名課程`, "success");
      } else {
        await enrollCourse(currentUser.userId, courseId);
        showAlert(`已成功報名課程`, "success");
      }

      // 重新載入數據
      if (activeView === "all") {
        fetchCourses();
      }
      triggerRefresh(); // 觸發學分統計和我的課程重新載入
    } catch (error) {
      console.error("Error with enrollment action:", error);
      showAlert(isEnrolled ? "取消報名失敗" : "報名課程失敗", "error");
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    setCurrentPage(1);
    if (view === "all") {
      setSearchTerm("");
    }
  };

  if (loading && courses.length === 0 && activeView === "all") {
    return (
      <div className="container student-dashboard">
        <h1 className="my-4">學生儀表板</h1>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container student-dashboard">
      <h1 className="my-4">學生儀表板</h1>

      {/* 提示訊息 */}
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

      {/* 學分統計 */}
      {currentUser && (
        <CreditStats
          studentId={currentUser.userId}
          refreshTrigger={refreshTrigger}
        />
      )}

      {/* 視圖切換 */}
      <div className="view-controls mb-4">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn ${
              activeView === "all" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handleViewChange("all")}
          >
            <i className="bi bi-grid me-2"></i>
            所有課程
          </button>
          {currentUser && (
            <button
              type="button"
              className={`btn ${
                activeView === "my" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => handleViewChange("my")}
            >
              <i className="bi bi-journal-check me-2"></i>
              我的課程
            </button>
          )}
        </div>
      </div>

      {activeView === "all" ? (
        <>
          {/* 搜尋欄 */}
          <div className="search-container">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="搜尋課程名稱、描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={clearSearch}
                >
                  <i className="bi bi-x-circle"></i> 清除
                </button>
              )}
            </div>
          </div>

          {/* 課程列表 */}
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="courses-container">
              <div className="row">
                {Array.isArray(courses) && courses.length > 0 ? (
                  courses.map((course) => {
                    const statusName = course.studentEnrollStatus?.statusName;

                    return (
                      <div key={course.courseId} className="col-md-4 mb-4">
                        <CourseCard
                          course={course}
                          onEnroll={(courseId, isEnrolled) =>
                            handleEnrollAction(courseId, isEnrolled, statusName)
                          }
                          isEnrolled={statusName === "Enrolled"}
                          studentEnrollmentStatus={statusName}
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
                        {searchTerm
                          ? `沒有找到與「${searchTerm}」相關的課程`
                          : "目前沒有可用的課程"}
                      </p>
                      {searchTerm && (
                        <button
                          className="btn btn-outline-primary"
                          onClick={clearSearch}
                        >
                          <i className="bi bi-arrow-left me-1"></i> 返回全部課程
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 分頁控制 */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination">
                {currentPage > 1 && (
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                )}

                {Array.from({ length: totalPages }).map((_, index) => {
                  if (
                    index + 1 === 1 ||
                    index + 1 === totalPages ||
                    (index + 1 >= currentPage - 2 &&
                      index + 1 <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={index}
                        className={`page-btn ${
                          currentPage === index + 1 ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    );
                  }

                  if (
                    index + 1 === currentPage - 3 ||
                    index + 1 === currentPage + 3
                  ) {
                    return (
                      <span
                        key={index}
                        className="px-2 d-flex align-items-center"
                      >
                        ...
                      </span>
                    );
                  }

                  return null;
                })}

                {currentPage < totalPages && (
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        /* 我的課程頁面 */
        currentUser && (
          <MyCourses
            courses={courses}
            studentId={currentUser.userId}
            onEnroll={handleEnrollAction}
            refreshTrigger={refreshTrigger}
          />
        )
      )}
    </div>
  );
};

export default StudentDashboard;
