import axios from "../utils/axiosConfig";

export const enrollCourse = async (userId, courseId) => {
  const response = await axios.post(`/enrollment/Enroll`, {
    StudentId: userId,
    CourseId: courseId,
  });
  return response.data;
};

export const cancelEnrollment = async (userId, courseId) => {
  const response = await axios.delete(`/enrollment/cancelEnroll`, {
    data: {
      studentId: userId,
      courseId: courseId,
    },
  });
  return response.data;
};

export const reEnroll = async (userId, courseId) => {
  const response = await axios.put(`/enrollment/reEnroll`, {
    StudentId: userId,
    CourseId: courseId,
  });
  return response.data;
};

export const getEnrollmentByStudentId = async (studentId) => {
  const response = await axios.get(`/enrollment?studentId=${studentId}`);
  return response.data;
};

export const getEnrollmentsByCourseId = async (courseId) => {
  const response = await axios.get(`/enrollment?courseId=${courseId}`);
  return response.data;
};
