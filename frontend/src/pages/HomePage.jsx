import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.scss";

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="container">
        <header className="text-center py-5">
          <h1 className="display-4 fw-bold">學生資訊系統</h1>
          <p className="lead">您管理學生資料、課程和註冊的一站式解決方案。</p>
          <div className="d-flex justify-content-center mt-4">
            <button className="btn btn-primary me-2">開始使用</button>
            <button className="btn btn-outline-secondary">瞭解更多</button>
          </div>
        </header>

        <div className="row g-4 my-5">
          <div className="col-md-4">
            <div className="card dashboard-card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="icon-wrapper mb-3">
                  <i className="bi bi-person-badge fs-1"></i>
                </div>
                <h5 className="card-title">學生儀表板</h5>
                <p className="card-text flex-grow-1">
                  存取您的課程資料，查看成績，提交作業，並追蹤您的學業進度。
                </p>
                <Link to="/dashboard" className="btn btn-primary mt-auto">
                  學生登入
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card dashboard-card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="icon-wrapper mb-3">
                  <i className="bi bi-mortarboard fs-1"></i>
                </div>
                <h5 className="card-title">教師儀表板</h5>
                <p className="card-text flex-grow-1">
                  管理課程，評分作業，追蹤學生表現，並與您的班級溝通。
                </p>
                <Link to="/dashboard" className="btn btn-primary mt-auto">
                  教師登入
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card dashboard-card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="icon-wrapper mb-3">
                  <i className="bi bi-gear fs-1"></i>
                </div>
                <h5 className="card-title">管理員儀表板</h5>
                <p className="card-text flex-grow-1">
                  監督系統運營，管理用戶，配置課程，並生成機構報告。
                </p>
                <Link to="/dashboard" className="btn btn-primary mt-auto">
                  管理員登入
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="features-section py-5 bg-light rounded">
          <h2 className="text-center mb-4">主要功能</h2>
          <div className="row g-4">
            <div className="col-md-3 col-sm-6">
              <div className="feature-item text-center">
                <i className="bi bi-journal-check mb-3 fs-2"></i>
                <h5>課程管理</h5>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="feature-item text-center">
                <i className="bi bi-graph-up mb-3 fs-2"></i>
                <h5>成績追蹤</h5>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="feature-item text-center">
                <i className="bi bi-calendar-check mb-3 fs-2"></i>
                <h5>日程計劃</h5>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="feature-item text-center">
                <i className="bi bi-chat-dots mb-3 fs-2"></i>
                <h5>溝通工具</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
