import axios from "../utils/axiosConfig";

const invitationCodeService = {
  // 獲取邀請碼列表
  getInvitationCodes: async (params = {}) => {
    const response = await axios.get("/invitationcode", { params });
    return response.data;
  },

  // 生成新邀請碼
  generateInvitationCode: async (data) => {
    const response = await axios.post("/invitationcode/generate", data);
    return response.data;
  },

  // 編輯邀請碼
  editInvitationCode: async ({ CodeId, data }) => {
    const response = await axios.post(`/invitationcode/edit/${CodeId}`, data);
    return response.data;
  },

  // 刪除邀請碼
  deleteInvitationCode: async (invitationCodeId) => {
    const response = await axios.delete(`/invitationcode/${invitationCodeId}`);
    return response.data;
  },

  // 獲取單個邀請碼詳情
  getInvitationCodeUsageById: async (invitationCodeId) => {
    const response = await axios.get(
      `/invitationcode/usage/${invitationCodeId}`
    );
    return response.data;
  },
};

export default invitationCodeService;
