using System.ComponentModel.DataAnnotations;

namespace student_information_system.Dtos
{
    public class EditInvitationCodeDto
    {
        [Range(2, 3)]
        public int RoleId { get; set; }
        public DateTime ExpirationDate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
