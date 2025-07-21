using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using student_information_system.Dtos;
using student_information_system.Models;
using student_information_system.Services;

namespace student_information_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UserController : ControllerBase
    {
        private readonly Std_info_sysContext _context;
        private readonly ISecurityService _securityService;
        public UserController(Std_info_sysContext std_Info_SysContext, ISecurityService securityService)
        {
            _context = std_Info_SysContext;
            _securityService = securityService;
        }

        // GET api/user (Get user)
        [HttpGet]
        public IActionResult GetAllUser([FromQuery] int page = 1, [FromQuery] int pageSize = 10,
                               [FromQuery] string? search = null, [FromQuery] int? roleId = null)
        {
            var query = _context.User.AsQueryable();

            // 套用搜尋條件
            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();
                query = query.Where(u =>
                       u.Username.ToLower().Contains(search) ||
                       (u.FirstName != null && u.FirstName.ToLower().Contains(search)) ||
                       (u.LastName != null && u.LastName.ToLower().Contains(search)) ||
                       (u.Email != null && u.Email.ToLower().Contains(search))
                   );
            }
            // 套用角色過濾
            if (roleId.HasValue)
            {
                query = query.Where(u => u.RoleId == roleId.Value);
            }

            // 計算總記錄數
            int totalItems = query.Count();
            int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            // 套用分頁
            var result = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    Username = u.Username,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    RoleId = u.RoleId,
                    RoleName = u.Role.RoleName,
                    DateOfBirth = u.DateOfBirth
                })
                .ToList();

            return Ok(new
            {
                users = result,
                pagination = new
                {
                    total = totalItems,
                    currentPage = page,
                    pageSize = pageSize,
                    totalPages = totalPages
                }
            });
        }

        // Get api/allUser/{roleId} (Get All user by roleid)
        [HttpGet("allUserName/{roleId}")]
        [Authorize(Roles = "Admin, Teacher")]
        public IActionResult GetAllUserByRoleId(int roleId)
        {
            var users = _context.User
                .Where(u => u.RoleId == roleId)
                .Select(u => new
                {
                    UserId = u.UserId,
                    userName = u.Username,
                    FullName = $"{u.FirstName} {u.LastName}".Trim()
                })
                .ToList();
            if (users.Count == 0)
            {
                return NotFound("No users found for the specified role.");
            }
            return Ok(users);
        }


        // PUT api/user/{id} (updateUser)
        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] UserUpdateDto userDto)
        {
            var user = _context.User.Find(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            if (userDto.Password != null)
            {
                user.PasswordHash = _securityService.HashPassword(userDto.Password);
            }

            user.Username = userDto.Username;
            user.RoleId = userDto.RoleId;
            user.FirstName = userDto.FirstName;
            user.LastName = userDto.LastName;
            user.Email = userDto.Email;
            user.DateOfBirth = userDto.DateOfBirth;
            _context.User.Update(user);
            _context.SaveChanges();
            return NoContent();
        }

        // POST api/user (createUser)
        [HttpPost]
        public IActionResult CreateUser([FromBody] RegisterDto userDto)
        {
            var hashedPassword = _securityService.HashPassword(userDto.Password);
            var user = new User
            {
                Username = userDto.Username,
                PasswordHash = hashedPassword,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                DateOfBirth = userDto.DateOfBirth,
                RoleId = userDto.RoleId
            };
            _context.User.Add(user);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetAllUser), new { id = user.UserId }, user);
        }

        // DELETE api/user/{id} (deleteUser)
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _context.User.Find(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            _context.User.Remove(user);
            _context.SaveChanges();
            return NoContent();

        }

    }
}
