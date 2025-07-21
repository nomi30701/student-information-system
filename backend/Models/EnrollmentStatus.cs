using System;
using System.Collections.Generic;

namespace student_information_system.Models;

public partial class EnrollmentStatus
{
    public int StatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<Enrollment> Enrollment { get; set; } = new List<Enrollment>();
}
