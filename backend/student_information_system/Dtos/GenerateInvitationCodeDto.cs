using System.ComponentModel.DataAnnotations;

namespace student_information_system.Dtos
{
    public class GenerateInvitationCodeDto
    {
        [Range(2, 3)]
        public int RoleId { get; set; }
        public int CreatorUserId { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public bool? IsActive { get; set; } = true;
    }
}
