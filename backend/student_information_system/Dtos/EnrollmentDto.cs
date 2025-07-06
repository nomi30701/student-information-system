namespace student_information_system.Dtos
{
    public class EnrollmentDto
    {
        public int EnroollmentId { get; set; }
        public int CourseId { get; set; }
        public string FullName { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public int StatusId { get; set; }
        public string StatusName { get; set; }
        public int? Grade { get; set; }
        public string? Comments { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
