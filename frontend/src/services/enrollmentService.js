import axiosInstance from "../utils/axiosConfig";

export const enrollCourse = async (userId, courseId) => {
  const response = await axiosInstance.post(`/enrollment/Enroll`, {
    StudentId: userId,
    CourseId: courseId,
  });
  return response.data;
};

export const cancelEnrollment = async (userId, courseId) => {
  const response = await axiosInstance.delete(`/enrollment/cancelEnroll`, {
    data: {
      studentId: userId,
      courseId: courseId,
    },
  });
  return response.data;
};

export const reEnroll = async (userId, courseId) => {
  const response = await axiosInstance.put(`/enrollment/reEnroll`, {
    StudentId: userId,
    CourseId: courseId,
  });
  return response.data;
};

export const getEnrollmentByStudentId = async (studentId) => {
  const response = await axiosInstance.get(
    `/enrollment?studentId=${studentId}`
  );
  return response.data;
};

export const getEnrollmentsByCourseId = async (courseId) => {
  const response = await axiosInstance.get(`/enrollment?courseId=${courseId}`);
  return response.data;
};
