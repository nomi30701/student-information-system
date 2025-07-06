using System;
using System.Collections.Generic;

namespace student_information_system.Models;

public partial class Role
{
    public int RoleId { get; set; }

    public string RoleName { get; set; } = null!;

    public virtual ICollection<InvitationCode> InvitationCode { get; set; } = new List<InvitationCode>();

    public virtual ICollection<User> User { get; set; } = new List<User>();
}
