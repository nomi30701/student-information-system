import axiosInstance from "../utils/axiosConfig";

const invitationCodeService = {
  // 獲取邀請碼列表
  getInvitationCodes: async (params = {}) => {
    const response = await axiosInstance.get("/invitationcode", { params });
    return response.data;
  },

  // 生成新邀請碼
  generateInvitationCode: async (data) => {
    const response = await axiosInstance.post("/invitationcode/generate", data);
    return response.data;
  },

  // 編輯邀請碼
  editInvitationCode: async ({ CodeId, data }) => {
    const response = await axiosInstance.post(
      `/invitationcode/edit/${CodeId}`,
      data
    );
    return response.data;
  },

  // 刪除邀請碼
  deleteInvitationCode: async (invitationCodeId) => {
    const response = await axiosInstance.delete(
      `/invitationcode/${invitationCodeId}`
    );
    return response.data;
  },

  // 獲取單個邀請碼詳情
  getInvitationCodeUsageById: async (invitationCodeId) => {
    const response = await axiosInstance.get(
      `/invitationcode/usage/${invitationCodeId}`
    );
    return response.data;
  },
};

export default invitationCodeService;
