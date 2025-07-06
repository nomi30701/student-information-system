using System;
using System.Collections.Generic;

namespace student_information_system.Models;

public partial class Course
{
    public int CourseId { get; set; }

    public string CourseName { get; set; } = null!;

    public string? Description { get; set; }

    public int Credits { get; set; }

    public int TeacherId { get; set; }

    public int? MaxStudent { get; set; }

    public bool IsEnrollable { get; set; }

    public virtual ICollection<Enrollment> Enrollment { get; set; } = new List<Enrollment>();

    public virtual User Teacher { get; set; } = null!;
}
