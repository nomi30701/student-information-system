import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import * as courseService from "../../services/courseService";
import CourseModal from "./AdminDashboardComponents/CourseModal";
import CourseDetailsModal from "./AdminDashboardComponents/CourseDetailsModal";

const TeacherDashboard = () => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // 資料分頁
  const [currentCoursePage, setCurrentCoursePage] = useState(1);
  const itemsPerPage = 10;
  const [totalCoursePages, setTotalCoursePages] = useState(0);

  // 搜尋
  const [courseSearchTerm, setCourseSearchTerm] = useState("");

  // 課程管理模態框與功能
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    courseName: null,
    description: null,
    credits: 1,
    teacherId: currentUser?.userId || null,
    maxStudent: null,
    isEnrollable: true,
  });
  const [showCourseDetailsModal, setShowCourseDetailsModal] = useState(false);
  const [courseDetails, setCourseDetails] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  // 添加課程搜尋延遲效果
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 500);
    return () => clearTimeout(timer);
  }, [courseSearchTerm, currentCoursePage]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await courseService.getCourses({
        page: currentCoursePage,
        pageSize: itemsPerPage,
        search: courseSearchTerm,
        teacherId: currentUser.userId, // 只獲取當前教師的課程
      });
      setCourses(response.courses);
      setTotalCoursePages(response.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching courses:", error);
      showAlert("無法獲取課程資料", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 顯示提示訊息
  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ ...alert, show: false });
    }, 3000);
  };

  const handleCourseSearch = (e) => {
    setCourseSearchTerm(e.target.value);
    setCurrentCoursePage(1); // 重置到第一頁
  };

  const handleCoursePageChange = (pageNumber) => {
    setCurrentCoursePage(pageNumber);
  };

  // 課程表單處理
  const handleCourseFormChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // 根據欄位名稱轉型
    if (["credits", "maxStudent"].includes(name)) {
      newValue = value === null ? null : parseInt(value, 10);
    }
    if (name === "isEnrollable") {
      newValue = value === "true" ? true : false;
    }
    setCourseFormData({ ...courseFormData, [name]: newValue });
  };

  // 編輯課程
  const handleEditCourse = (course) => {
    setCurrentCourse(course);
    setCourseFormData({
      courseName: course.courseName,
      description: course.description,
      credits: course.credits,
      teacherId: course.teacherId,
      maxStudent: course.maxStudent,
      isEnrollable: course.isEnrollable,
    });
    setShowCourseModal(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("確定要刪除此課程嗎？")) {
      try {
        await courseService.deleteCourse(courseId);
        fetchCourses(); // 重新獲取課程列表
        showAlert("課程已成功刪除", "success");
      } catch (error) {
        console.error("Error deleting course:", error);
        showAlert("刪除課程時發生錯誤", "error");
      }
    }
  };

  // 提交課程表單
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCourse) {
        await courseService.updateCourse(
          currentCourse.courseId,
          courseFormData
        );
        showAlert("課程已成功更新", "success");
      } else {
        await courseService.createCourse({
          ...courseFormData,
          teacherId: currentUser.userId, // 確保新課程指定給當前教師
        });
        showAlert("課程已成功創建", "success");
      }
      setShowCourseModal(false);
      fetchCourses();
      resetCourseForm();
    } catch (error) {
      console.error("Error saving course:", error);
      showAlert("保存課程時發生錯誤", "error");
    }
  };

  // 重置課程表單
  const resetCourseForm = () => {
    setCurrentCourse(null);
    setCourseFormData({
      courseName: null,
      description: null,
      credits: 1,
      teacherId: currentUser.userId,
      maxStudent: null,
      isEnrollable: true,
    });
  };

  // 查看課程詳情
  const handleViewCourseDetails = (course) => {
    setCourseDetails(course);
    setShowCourseDetailsModal(true);
  };

  return (
    <div className="teacher-dashboard">
      <div className="tab-pane">
        <div className="header-actions">
          <h3>我的課程管理</h3>
          <button
            className="btn btn-primary"
            onClick={() => setShowCourseModal(true)}
          >
            <i className="bi bi-plus-circle"></i> 新增課程
          </button>
        </div>

        {alert.show && (
          <div className={`alert alert-${alert.type}`}>{alert.message}</div>
        )}

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
                  placeholder="搜尋課程..."
                  value={courseSearchTerm}
                  onChange={handleCourseSearch}
                />
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>課程名稱</th>
                  <th>描述</th>
                  <th>學分</th>
                  <th>最大人數</th>
                  <th>可報名</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      尚未建立任何課程
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course.courseId}>
                      <td>{course.courseName}</td>
                      <td>{course.description || "—"}</td>
                      <td>{course.credits}</td>
                      <td>{course.maxStudent || "不限制"}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            course.isEnrollable ? "active" : "inactive"
                          }`}
                        >
                          {course.isEnrollable ? "可報名" : "不可報名"}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="btn btn-edit"
                          onClick={() => handleEditCourse(course)}
                          title="編輯課程"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-view"
                          onClick={() => handleViewCourseDetails(course)}
                          title="查看學生報名情況"
                        >
                          <i className="bi bi-people"></i>
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDeleteCourse(course.courseId)}
                          title="刪除課程"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* 課程分頁控制 */}
            {totalCoursePages > 1 && (
              <div className="pagination">
                {Array.from({
                  length: totalCoursePages,
                }).map((_, index) => (
                  <button
                    key={index}
                    className={`page-btn ${
                      currentCoursePage === index + 1 ? "active" : ""
                    }`}
                    onClick={() => handleCoursePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        <CourseModal
          show={showCourseModal}
          onClose={() => {
            setShowCourseModal(false);
            resetCourseForm();
          }}
          currentCourse={currentCourse}
          formData={courseFormData}
          onChange={handleCourseFormChange}
          onSubmit={handleCourseSubmit}
          isTeacher={true}
        />

        <CourseDetailsModal
          show={showCourseDetailsModal}
          onClose={() => setShowCourseDetailsModal(false)}
          courseDetails={courseDetails}
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;
