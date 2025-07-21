using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using student_information_system.Dtos;
using student_information_system.Models;

namespace student_information_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {

        private readonly Std_info_sysContext _context;
        public StatisticsController(Std_info_sysContext std_Info_SysContext)
        {
            _context = std_Info_SysContext;
        }


        // Get api/statistics
        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetStatic()
        {
            var dto = new StatisticsDto
            {
                TotalStudents = _context.User.Count(u => u.RoleId == 1),
                TotalTeachers = _context.User.Count(u => u.RoleId == 2),
                TotalAdmins = _context.User.Count(u => u.RoleId == 3),
                TotalCourses = _context.Course.Count(),
                TotalEnrollments = _context.Enrollment.Count()
            };
            return Ok(dto);
        }

        // Get api/statistics/student/{userId}/credits

        [HttpGet("student/{userId}/credits")]
        [Authorize]
        public async Task<IActionResult> GetStudentCredits(int userId)
        {
            var stats = await _context.Enrollment
                .Where(e => e.StudentId == userId)
                .GroupBy(e => 1)
                .Select(g => new StudentCreditStatsDto
                {
                    EnrolledCredits = g.Where(e => e.StatusId == 1).Sum(e => e.Course.Credits),
                    WithdrawnCredits = g.Where(e => e.StatusId == 2).Sum(e => e.Course.Credits),
                    CompletedCredits = g.Where(e => e.StatusId == 3).Sum(e => e.Course.Credits)
                })
                .FirstOrDefaultAsync()
              ?? new StudentCreditStatsDto();
            return Ok(stats);
        }
    }
}
