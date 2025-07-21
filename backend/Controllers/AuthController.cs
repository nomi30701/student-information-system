using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using student_information_system.Dtos;
using student_information_system.Models;
using student_information_system.Services;

namespace student_information_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly Std_info_sysContext _context;
        private readonly ISecurityService _securityService;

        public AuthController(Std_info_sysContext context, ISecurityService securityService)
        {
            _context = context;
            _securityService = securityService;
        }

        // POST /api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto value)
        {
            var user = await _context.User
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Username == value.Username);

            if (user == null || !_securityService.VerifyPassword(user.PasswordHash, value.Password))
            {
                return Unauthorized(new { message = "用戶名或密碼不正確" });
            }

            var token = _securityService.GenerateJwtToken(user);

            return Ok(new AuthUserDto
            {
                UserId = user.UserId,
                Username = user.Username,
                RoleName = user.Role.RoleName,
                RoleId = user.RoleId,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                DateOfBirth = user.DateOfBirth,
                TokenExpires = DateTime.UtcNow.AddHours(1),
                Token = token
            });
        }

        // POST /api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            // 確認用戶名是否已存在
            if (await _context.User.AnyAsync(u => u.Username == model.Username))
            {
                return BadRequest(new { message = "用戶名已存在" });
            }

            InvitationCode invitationCode = null;

            if (model.RoleId != 1)
            {
                // 檢查邀請碼是否啟用
                invitationCode = await _context.InvitationCode.FirstOrDefaultAsync(
                    ic => ic.Code == model.invitationCode && ic.IsActive);

                if (invitationCode == null)
                {
                    return BadRequest(new { message = "無效的邀請碼" });
                }
                if (DateTime.Now > invitationCode.ExpirationDate)
                {
                    return BadRequest(new { message = "邀請碼已過期" });
                }
                if (invitationCode.RoleId != model.RoleId)
                {
                    return BadRequest(new { message = "邀請碼不適用於此角色" });
                }

                invitationCode.IsUsed = true;
                _context.InvitationCode.Update(invitationCode);
            }

            var hashedPassword = _securityService.HashPassword(model.Password);
            var user = new User
            {
                Username = model.Username,
                PasswordHash = hashedPassword,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                DateOfBirth = model.DateOfBirth,
                RoleId = model.RoleId
            };
            _context.User.Add(user);
            await _context.SaveChangesAsync();

            // 記錄邀請碼使用情況
            if (invitationCode != null)
            {
                var usage = new InvitationCodeUsage
                {
                    InvitationCodeId = invitationCode.InvitationCodeId,
                    UserId = user.UserId
                };
                _context.InvitationCodeUsage.Add(usage);
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "註冊成功" });
        }
    }
}