using System;
using System.Collections.Generic;

namespace student_information_system.Models;

public partial class InvitationCodeUsage
{
    public int UsageId { get; set; }

    public int? InvitationCodeId { get; set; }

    public int? UserId { get; set; }

    public DateTime UsageDate { get; set; }

    public virtual InvitationCode? InvitationCode { get; set; }

    public virtual User? User { get; set; }
}
