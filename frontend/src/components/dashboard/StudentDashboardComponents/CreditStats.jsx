import React, { useState, useEffect } from "react";
import { getStudentCreditStatistics } from "../../../services/statisticsService";
import "./CreditStats.scss";

const CreditStats = ({ studentId, refreshTrigger = 0 }) => {
  const [stats, setStats] = useState({
    enrolledCredits: 0,
    completedCredits: 0,
    withdrawnCredits: 0,
  });
  const [loading, setLoading] = useState(false);

  // 獲取學分統計
  const fetchAndCalculateStats = async () => {
    if (!studentId) return;

    try {
      setLoading(true);
      const credits = await getStudentCreditStatistics(studentId);
      setStats(credits);
    } catch (error) {
      console.error("Error fetching enrollment data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndCalculateStats();
  }, [studentId, refreshTrigger]);

  const totalCredits =
    (stats.enrolledCredits || 0) +
    (stats.completedCredits || 0) +
    (stats.withdrawnCredits || 0);

  if (loading) {
    return (
      <div className="credit-stats loading">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">計算學分統計中...</p>
      </div>
    );
  }

  return (
    <div className="credit-stats">
      <div className="stats-header">
        <h4>
          <i className="bi bi-mortarboard me-2"></i>
          學分統計
        </h4>
      </div>

      <div className="stats-grid">
        <div className="stat-card enrolled">
          <div className="stat-icon">
            <i className="bi bi-journal-plus"></i>
          </div>
          <div className="stat-content">
            <h5>已報名</h5>
            <div className="stat-value">{stats.enrolledCredits}</div>
            <small>學分</small>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">
            <i className="bi bi-check-circle"></i>
          </div>
          <div className="stat-content">
            <h5>已完成</h5>
            <div className="stat-value">{stats.completedCredits}</div>
            <small>學分</small>
          </div>
        </div>

        <div className="stat-card withdrawn">
          <div className="stat-icon">
            <i className="bi bi-x-circle"></i>
          </div>
          <div className="stat-content">
            <h5>已退選</h5>
            <div className="stat-value">{stats.withdrawnCredits}</div>
            <small>學分</small>
          </div>
        </div>

        <div className="stat-card total">
          <div className="stat-icon">
            <i className="bi bi-award"></i>
          </div>
          <div className="stat-content">
            <h5>總計</h5>
            <div className="stat-value">{totalCredits}</div>
            <small>學分</small>
          </div>
        </div>
      </div>

      {/* 完成進度條 */}
      <div className="progress-section">
        <div className="progress-header">
          <span>完成進度</span>
          <span>
            {stats.completedCredits} / {totalCredits} 學分
          </span>
        </div>
        <div className="progress">
          <div
            className="progress-bar"
            style={{
              width: `${
                totalCredits > 0
                  ? Math.round((stats.completedCredits / totalCredits) * 100)
                  : 0
              }%`,
            }}
          ></div>
        </div>
        <small className="progress-text">
          完成率:{" "}
          {totalCredits > 0
            ? Math.round((stats.completedCredits / totalCredits) * 100)
            : 0}
          %
        </small>
      </div>
    </div>
  );
};

export default CreditStats;
