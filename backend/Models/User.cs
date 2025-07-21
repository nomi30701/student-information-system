using System;
using System.Collections.Generic;

namespace student_information_system.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public int RoleId { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Email { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public DateTime? CreateDate { get; set; }

    public virtual ICollection<Course> Course { get; set; } = new List<Course>();

    public virtual ICollection<Enrollment> Enrollment { get; set; } = new List<Enrollment>();

    public virtual ICollection<InvitationCode> InvitationCode { get; set; } = new List<InvitationCode>();

    public virtual ICollection<InvitationCodeUsage> InvitationCodeUsage { get; set; } = new List<InvitationCodeUsage>();

    public virtual Role Role { get; set; } = null!;
}
