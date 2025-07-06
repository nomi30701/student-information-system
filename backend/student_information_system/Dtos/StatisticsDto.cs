namespace student_information_system.Dtos
{
    // Admin 統計人數、課程數量、註冊人數等資訊的 DTO
    public class StatisticsDto
    {
        public int TotalStudents { get; set; } = 0;
        public int TotalTeachers { get; set; } = 0;
        public int TotalAdmins { get; set; } = 0;
        public int TotalCourses { get; set; } = 0;
        public int TotalEnrollments { get; set; } = 0;
    }

    // 學生學分統計的 DTO
    public class StudentCreditStatsDto
    {
        public int EnrolledCredits { get; set; } = 0;
        public int WithdrawnCredits { get; set; } = 0;
        public int CompletedCredits { get; set; } = 0;
    }
}
