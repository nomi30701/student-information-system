namespace student_information_system.Dtos
{
    public class InvitationCodeDto
    {
        public int InvitationCodeId { get; set; }
        public string Code { get; set; }
        public string RoleName { get; set; }
        public int CreatorUserId { get; set; }
        public string CreatorUsername { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public bool IsUsed { get; set; }
        public bool IsActive { get; set; }
    }
}
