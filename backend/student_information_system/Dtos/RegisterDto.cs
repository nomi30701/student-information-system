using System.ComponentModel.DataAnnotations;

namespace student_information_system.Dtos
{
    public class RegisterDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [Range(1, 3)]
        public int RoleId { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string? invitationCode { get; set; }
    }
}
