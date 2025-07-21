using Microsoft.IdentityModel.Tokens;
using student_information_system.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace student_information_system.Services
{
    public interface ISecurityService
    {
        bool VerifyPassword(string storedHash, string password);
        string HashPassword(string password);
        string GenerateJwtToken(User user);
        string GenerateRandomCode(int length = 8);
    }

    public class SecurityService : ISecurityService
    {
        private readonly IConfiguration _configuration;

        public SecurityService(IConfiguration configuration)
        {
            _configuration = configuration;

        }

        // password驗證
        public bool VerifyPassword(string storedHash, string password)
        {
            try
            {
                return BCrypt.Net.BCrypt.Verify(password, storedHash);
            }
            catch
            {
                return false;
            }
        }

        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
        }

        public string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.RoleName),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["JwtSettings:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // 邀請碼生成
        public string GenerateRandomCode(int length = 8)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}