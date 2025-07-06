import React, { useEffect, useState } from "react";
import invitationCodeService from "../../../services/invitationCodeService";
import InvitationCodeModal from "../AdminDashboardComponents/InvitationCodeModal";
import InvitationCodeDetailsModal from "../AdminDashboardComponents/InvitationCodeDetailsModal";
import { useAuth } from "../../../contexts/AuthContext";

const InvitationCodeManagement = ({ roles, showAlert }) => {
  const [invitationCodes, setInvitationCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  // 資料分頁
  const [currentInvitationPage, setCurrentInvitationPage] = useState(1);
  const itemsPerPage = 10;
  const [totalInvitationPages, setTotalInvitationPages] = useState(0);

  // 搜尋
  const [invitationSearchTerm, setInvitationSearchTerm] = useState("");

  // 邀請碼模態框狀態
  const [showInvitationCodeModal, setShowInvitationCodeModal] = useState(false);
  const [currentInvitationCode, setCurrentInvitationCode] = useState(null);
  const [invitationCodeFormData, setInvitationCodeFormData] = useState({
    roleId: null,
    expirationDate: null,
    isActive: true,
  });
  const [showInvitationCodeDetailsModal, setShowInvitationCodeDetailsModal] =
    useState(false);

  // 邀請碼使用紀錄
  const [selectedCodeDetails, setSelectedCodeDetails] = useState(null);
  const [usageRecords, setUsageRecords] = useState([]);

  useEffect(() => {
    fetchInvitationCodes();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInvitationCodes();
    }, 500);
    return () => clearTimeout(timer);
  }, [invitationSearchTerm, currentInvitationPage]);

  const fetchInvitationCodes = async () => {
    try {
      setIsLoading(true);
      const response = await invitationCodeService.getInvitationCodes({
        page: currentInvitationPage,
        pageSize: itemsPerPage,
        search: invitationSearchTerm,
      });
      setInvitationCodes(response.invitationCodes);
      setTotalInvitationPages(response.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching invitation codes:", error);
      showAlert("無法獲取邀請碼資料", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvitationCodeSearch = (e) => {
    setInvitationSearchTerm(e.target.value);
    setCurrentInvitationPage(1);
  };

  const handleInvitationCodePageChange = (pageNumber) => {
    setCurrentInvitationPage(pageNumber);
  };

  const handleInvitationCodeFormChange = (e) => {
    const { name, value } = e.target;
    setInvitationCodeFormData({ ...invitationCodeFormData, [name]: value });
  };

  const handleEditInvitationCode = (code) => {
    setCurrentInvitationCode(code);
    setInvitationCodeFormData({
      roleId: code.roleId,
      expirationDate: new Date(code.expirationDate).toISOString().slice(0, 16),
      isActive: code.isActive,
    });
    setShowInvitationCodeModal(true);
  };

  const handleInvitationCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = {
        ...invitationCodeFormData,
        roleId: parseInt(invitationCodeFormData.roleId, 10),
      };

      if (currentInvitationCode) {
        // 編輯邀請碼
        await invitationCodeService.editInvitationCode({
          CodeId: currentInvitationCode.invitationCodeId,
          data: formDataToSend,
        });
        showAlert("邀請碼已成功更新", "success");
      } else {
        // 生成新邀請碼
        await invitationCodeService.generateInvitationCode({
          creatorUserId: currentUser.userId,
          ...formDataToSend,
        });
        showAlert("邀請碼已成功生成", "success");
      }
      setShowInvitationCodeModal(false);
      fetchInvitationCodes();
      resetInvitationCodeForm();
    } catch (error) {
      console.error("Error saving invitation code:", error);
      showAlert("保存邀請碼時發生錯誤", "error");
    }
  };

  const resetInvitationCodeForm = () => {
    setCurrentInvitationCode(null);
    setInvitationCodeFormData({
      roleId: null,
      expirationDate: null,
      isActive: true,
    });
  };

  const handleViewInvitationCodeUsage = async (code) => {
    try {
      setSelectedCodeDetails(code);
      setUsageRecords([]);
      setShowInvitationCodeDetailsModal(true);

      // 獲取使用紀錄
      const usageResponse =
        await invitationCodeService.getInvitationCodeUsageById(
          code.invitationCodeId
        );
      setUsageRecords(usageResponse || []);
    } catch (error) {
      console.error("Error fetching invitation code usage records:", error);
      showAlert("無法獲取邀請碼使用紀錄", "error");
    }
  };

  const handleDeleteInvitationCode = async (invitationCodeId) => {
    if (window.confirm("確定要刪除此邀請碼嗎？")) {
      try {
        await invitationCodeService.deleteInvitationCode(invitationCodeId);
        fetchInvitationCodes();
        showAlert("邀請碼已成功刪除", "success");
      } catch (error) {
        console.error("Error deleting invitation code:", error);
        showAlert("刪除邀請碼時發生錯誤", "error");
      }
    }
  };

  return (
    <div className="tab-pane">
      <div className="header-actions">
        <h3>邀請碼管理</h3>
        <button
          className="btn btn-primary"
          onClick={() => setShowInvitationCodeModal(true)}
        >
          <i className="bi bi-plus-circle"></i> 生成邀請碼
        </button>
      </div>

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
                placeholder="搜尋邀請碼..."
                value={invitationSearchTerm}
                onChange={handleInvitationCodeSearch}
              />
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>邀請碼</th>
                <th>適用角色</th>
                <th>創建者</th>
                <th>過期時間</th>
                <th>狀態</th>
                <th>使用狀態</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {invitationCodes.map((code) => (
                <tr key={code.invitationCodeId}>
                  <td className="code-cell">{code.code}</td>
                  <td>{code.roleName}</td>
                  <td>{code.creatorUsername}</td>
                  <td>
                    {new Date(code.expirationDate).toLocaleString("zh-TW")}
                  </td>
                  <td>
                    <span
                      className={`status ${
                        code.isActive ? "active" : "inactive"
                      }`}
                    >
                      {code.isActive ? "啟用" : "停用"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status ${code.isUsed ? "used" : "unused"}`}
                    >
                      {code.isUsed ? "已使用" : "未使用"}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEditInvitationCode(code)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-view"
                      onClick={() => handleViewInvitationCodeUsage(code)}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() =>
                        handleDeleteInvitationCode(code.invitationCodeId)
                      }
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 邀請碼分頁控制 */}
          <div className="pagination">
            {Array.from({ length: totalInvitationPages }).map((_, index) => (
              <button
                key={index}
                className={`page-btn ${
                  currentInvitationPage === index + 1 ? "active" : ""
                }`}
                onClick={() => handleInvitationCodePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}

      <InvitationCodeModal
        show={showInvitationCodeModal}
        onClose={() => {
          setShowInvitationCodeModal(false);
          resetInvitationCodeForm();
        }}
        currentCode={currentInvitationCode}
        formData={invitationCodeFormData}
        onChange={handleInvitationCodeFormChange}
        onSubmit={handleInvitationCodeSubmit}
        roles={roles.filter(
          (role) => role.roleName !== "Student" && role.roleId !== 1
        )}
      />

      <InvitationCodeDetailsModal
        show={showInvitationCodeDetailsModal}
        onClose={() => {
          setShowInvitationCodeDetailsModal(false);
          setSelectedCodeDetails(null);
          setUsageRecords([]);
        }}
        codeDetails={selectedCodeDetails}
        usageRecords={usageRecords}
      />
    </div>
  );
};

export default InvitationCodeManagement;
