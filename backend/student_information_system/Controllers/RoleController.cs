using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using student_information_system.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace student_information_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RoleController : ControllerBase
    {

        private readonly Std_info_sysContext _context;
        public RoleController(Std_info_sysContext std_Info_SysContext)
        {
            _context = std_Info_SysContext;
        }

        // GET api/role
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Role>>> GetRoles()
        {
            var roles = await _context.Role.ToListAsync();
            return Ok(roles);
        }
    }
}
