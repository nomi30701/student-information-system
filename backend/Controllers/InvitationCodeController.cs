using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using student_information_system.Dtos;
using student_information_system.Models;
using student_information_system.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace student_information_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class InvitationCodeController : ControllerBase
    {
        private readonly Std_info_sysContext _context;
        private readonly ISecurityService _securityService;

        public InvitationCodeController(Std_info_sysContext context, ISecurityService securityService)
        {
            _context = context;
            _securityService = securityService;
        }

        // GET /api/invitationcode/
        [HttpGet]
        public async Task<IActionResult> GetInvitationCodes([FromQuery] int page = 1,
                                                            [FromQuery] int pageSize = 10,
                                                            [FromQuery] string? search = null)
        {
            // 查詢邀請碼並套用搜尋條件
            var query = _context.InvitationCode
                        .Include(ic => ic.Role)
                        .Include(ic => ic.CreatorUser)
                        .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();
                query = query.Where(ic => ic.Code.ToLower().Contains(search) ||
                                          ic.Role.RoleName.ToLower().Contains(search) ||
                                          ic.CreatorUser.Username.ToLower().Contains(search));
            }
            // 計算總記錄數
            int totalItems = await query.CountAsync();
            int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            // 套用分頁
            var result = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(ic => new InvitationCodeDto
                {
                    InvitationCodeId = ic.InvitationCodeId,
                    Code = ic.Code,
                    RoleName = ic.Role.RoleName,
                    CreatorUserId = ic.CreatorUserId,
                    CreatorUsername = ic.CreatorUser.Username,
                    CreationDate = ic.CreationDate ?? DateTime.Now,
                    ExpirationDate = ic.ExpirationDate,
                    IsUsed = ic.IsUsed,
                    IsActive = ic.IsActive,
                })
                .ToListAsync();

            return Ok(new
            {
                invitationCodes = result,
                pagination = new
                {
                    total = totalItems,
                    currentPage = page,
                    pageSize = pageSize,
                    totalPages = totalPages
                }
            });
        }

        // 邀請碼使用情況
        // Get /api/invitationcode/usage/{CodeId}
        [HttpGet("usage/{codeId}")]
        public async Task<IActionResult> GetInvitationCodeUsage(int codeId)
        {
            var invitationCode = await _context.InvitationCode
                .Include(ic => ic.InvitationCodeUsage)
                .ThenInclude(u => u.User)
                .FirstOrDefaultAsync(ic => ic.InvitationCodeId == codeId);

            if (invitationCode == null)
            {
                return NotFound(new { message = "邀請碼不存在" });
            }

            if (invitationCode.InvitationCodeUsage == null)
            {
                return NotFound(new { message = "沒有使用此邀請碼的記錄" });
            }

            var usageList = invitationCode.InvitationCodeUsage
                .Select(u => new InvitationCodeUsageDto
                {
                    UserId = u.UserId ?? 0,
                    Username = u.User?.Username ?? "",
                    UsageDate = u.UsageDate
                })
                .ToList();

            return Ok(usageList);
        }




        // POST /api/invitationcode/generate
        [HttpPost("generate")]
        public async Task<IActionResult> GenerateInvitationCode([FromBody] GenerateInvitationCodeDto value)
        {
            string code = _securityService.GenerateRandomCode();

            // 創建邀請碼實體
            var invitationCode = new InvitationCode
            {
                Code = code,
                RoleId = value.RoleId,
                CreatorUserId = value.CreatorUserId,
                ExpirationDate = value.ExpirationDate ?? DateTime.Now.AddDays(7), // 默認7天有效期
                IsUsed = false,
                IsActive = value.IsActive ?? true
            };

            _context.InvitationCode.Add(invitationCode);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // POST /api/invitationcode/edit
        [HttpPost("edit/{CodeId}")]
        public async Task<IActionResult> EditInvitationCode(int CodeId, [FromBody] EditInvitationCodeDto value)
        {
            var invitationCode = await _context.InvitationCode.FindAsync(CodeId);
            if (invitationCode == null)
            {
                return NotFound(new { message = "邀請碼不存在" });
            }
            // 更新邀請碼信息
            invitationCode.RoleId = value.RoleId;
            invitationCode.ExpirationDate = value.ExpirationDate;
            invitationCode.IsActive = value.IsActive;
            _context.InvitationCode.Update(invitationCode);
            await _context.SaveChangesAsync();
            return Ok(new { message = "邀請碼已更新" });
        }

        // DELETE /api/invitationcode/{id}
        [HttpDelete("{CodeId}")]
        public async Task<IActionResult> DeleteInvitationCode(int CodeId)
        {
            var invitationCode = await _context.InvitationCode.FindAsync(CodeId);
            if (invitationCode == null)
            {
                return NotFound(new { message = "邀請碼不存在" });
            }
            _context.InvitationCode.Remove(invitationCode);
            await _context.SaveChangesAsync();
            return Ok(new { message = "邀請碼已刪除" });
        }
    }
}
