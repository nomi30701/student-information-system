import React, { useState, useEffect } from "react";
import * as userService from "../../../services/userService";
import { useAuth } from "../../../contexts/AuthContext";
import "./Modals.scss";

const CourseModal = ({
  show,
  onClose,
  currentCourse,
  formData,
  onChange,
  onSubmit,
  isTeacher = false, // 新增參數，預設為 false
}) => {
  const [teachers, setTeachers] = useState([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);

  const { currentUser } = useAuth();

  // 獲取所有教師
  const fetchTeachers = async () => {
    try {
      setIsLoadingTeachers(true);
      const response = await userService.getAllUserNameByRoleid(2);
      setTeachers(response);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setTeachers([]);
    } finally {
      setIsLoadingTeachers(false);
    }
  };

  // 當模態框顯示時獲取教師資料
  useEffect(() => {
    if (show) {
      fetchTeachers();
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h4>{currentCourse ? "編輯課程" : "新增課程"}</h4>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>課程名稱*</label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName ?? ""}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label>描述</label>
              <textarea
                rows={3}
                name="description"
                value={formData.description ?? ""}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label>學分*</label>
              <input
                type="number"
                name="credits"
                value={formData.credits ?? ""}
                onChange={onChange}
                required
                min="1"
                defaultValue={0}
              />
            </div>

            <div className="form-group">
              <label>最大學生數</label>
              <input
                type="number"
                name="maxStudent"
                value={formData.maxStudent > 0 ? formData.maxStudent : null}
                onChange={onChange}
                min="1"
                placeholder="請輸入大於 0 的數字"
              />
            </div>

            <div className="form-group">
              <label>指派教師*</label>
              {isTeacher ? (
                // 教師視圖 - 顯示固定的教師資訊
                <div className="teacher-info">
                  <span className="static-field">
                    {teachers.find((t) => t.userId === currentUser.userId)
                      ?.fullName || currentUser.username}
                  </span>
                  <input
                    type="hidden"
                    name="teacherId"
                    value={currentUser.userId}
                  />
                  <small className="form-text text-muted">
                    教師無法變更課程指派
                  </small>
                </div>
              ) : (
                // 管理員視圖 - 允許選擇教師
                <select
                  name="teacherId"
                  value={formData.teacherId ?? ""}
                  onChange={onChange}
                  disabled={isLoadingTeachers}
                  required
                >
                  <option value="">
                    {isLoadingTeachers ? "載入教師中..." : "選擇教師"}
                  </option>
                  {teachers.map((teacher) => (
                    <option key={teacher.userId} value={teacher.userId}>
                      {`${teacher.fullName} (${teacher.userName})`}
                    </option>
                  ))}
                </select>
              )}

              {!isTeacher && isLoadingTeachers && (
                <small className="form-text text-muted">
                  正在載入教師資料...
                </small>
              )}
              {!isTeacher && !isLoadingTeachers && teachers.length === 0 && (
                <small className="form-text text-warning">
                  目前沒有可用的教師
                </small>
              )}
            </div>

            <div className="form-group">
              <label>是否可報名*</label>
              <select
                name="isEnrollable"
                value={formData.isEnrollable ?? ""}
                onChange={onChange}
                required
              >
                <option value="">請選擇</option>
                <option value="true">可報名</option>
                <option value="false">不可報名</option>
              </select>
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
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoadingTeachers}
            >
              {currentCourse ? "更新" : "創建"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
