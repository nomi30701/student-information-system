namespace student_information_system.Dtos
{
    public class CourseDto
    {
        public int? CourseId { get; set; }
        public string CourseName { get; set; }
        public string? Description { get; set; }
        public int Credits { get; set; }
        public int TeacherId { get; set; }
        public string? TeacherName { get; set; }
        public int? MaxStudent { get; set; }
        public int? EnrolledCount { get; set; } = 0;
        public bool IsEnrollable { get; set; }
        public StudentEnrollStatusDto? StudentEnrollStatus { get; set; } // 學生報名狀態ID，若傳入學生ID則回傳該學生報名狀態
    }

    public class StudentEnrollStatusDto
    {
        public int StatusId { get; set; }
        public string StatusName { get; set; }
    }
}
