using System.ComponentModel.DataAnnotations;

namespace student_information_system.Dtos
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [Range(1, 3)]
        public int RoleId { get; set; }
        public string? RoleName { get; set; }
        public DateOnly? DateOfBirth { get; set; }
    }
    public class AuthUserDto : UserDto
    {
        public string Token { get; set; }
        public DateTime TokenExpires { get; set; }
    }
    public class UserUpdateDto : UserDto
    {
        public string? Password { get; set; }
    }
}
