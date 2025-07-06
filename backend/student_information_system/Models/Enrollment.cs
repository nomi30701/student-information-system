using System;
using System.Collections.Generic;

namespace student_information_system.Models;

public partial class Enrollment
{
    public int EnrollmentId { get; set; }

    public int StudentId { get; set; }

    public int CourseId { get; set; }

    public DateTime? EnrollmentDate { get; set; }

    public int StatusId { get; set; }

    public int? Grade { get; set; }

    public string? Comments { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public virtual Course Course { get; set; } = null!;

    public virtual EnrollmentStatus Status { get; set; } = null!;

    public virtual User Student { get; set; } = null!;
}
