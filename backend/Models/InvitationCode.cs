using System;
using System.Collections.Generic;

namespace student_information_system.Models;

public partial class InvitationCode
{
    public int InvitationCodeId { get; set; }

    public string Code { get; set; } = null!;

    public int RoleId { get; set; }

    public int CreatorUserId { get; set; }

    public DateTime? CreationDate { get; set; }

    public DateTime ExpirationDate { get; set; }

    public bool IsUsed { get; set; }

    public bool IsActive { get; set; }

    public virtual User CreatorUser { get; set; } = null!;

    public virtual ICollection<InvitationCodeUsage> InvitationCodeUsage { get; set; } = new List<InvitationCodeUsage>();

    public virtual Role Role { get; set; } = null!;
}
