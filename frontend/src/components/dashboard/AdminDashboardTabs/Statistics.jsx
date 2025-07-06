import React, { useEffect, useState } from "react";
import { getUserStatistics } from "../../../services/statisticsService";

const Statistics = () => {

  // 狀態管理
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalEnrollments, setTotalEnrollments] = useState(0);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const data = await getUserStatistics();
      const { totalAdmins, totalTeachers, totalStudents, totalCourses, totalEnrollments } = data;
      setTotalUsers(totalAdmins + totalTeachers + totalStudents);
      setTotalCourses(totalCourses);
      setTotalEnrollments(totalEnrollments || 0);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  return (
    <div className="tab-pane">
      <h3>系統統計</h3>
      <div className="stats-cards">
        <div className="stat-card user-count">
          <h5>用戶總數</h5>
          <div className="stat-value">{totalUsers}</div>
        </div>
        <div className="stat-card course-count">
          <h5>課程總數</h5>
          <div className="stat-value">{totalCourses}</div>
        </div>
        <div className="stat-card enrollment-count">
          <h5>報名總數</h5>
          <div className="stat-value">{totalEnrollments}</div>
        </div>
      </div>

      <div className="stats-charts">
        <div className="chart-card">
          <div className="chart-header">用戶角色分佈</div>
          <div className="chart-body">
            {/* 這裡可以使用 Chart.js 等圖表庫顯示角色分佈 */}
            <p className="chart-placeholder">此處可實現角色分佈圓餅圖</p>
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">最熱門課程</div>
          <div className="chart-body">
            {/* 這裡可以使用 Chart.js 等圖表庫顯示課程報名統計 */}
            <p className="chart-placeholder">此處可實現課程報名柱狀圖</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
