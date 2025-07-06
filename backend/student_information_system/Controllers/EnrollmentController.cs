using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using student_information_system.Dtos;
using student_information_system.Models;


namespace student_information_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentController : ControllerBase
    {
        private readonly Std_info_sysContext _context;
        public EnrollmentController(Std_info_sysContext std_Info_SysContext)
        {
            _context = std_Info_SysContext;
        }

        //報名課程
        // POST api/enrollment/enroll
        [Authorize(Roles="Student")]
        [HttpPost("Enroll")]
        public IActionResult EnrollmentPost([FromBody] EnrollDto value)
        {
            // 檢查學生是否已報名
            var existingEnrollment = _context.Enrollment.FirstOrDefault(e =>
                e.CourseId == value.CourseId && e.StudentId == value.StudentId);

            if (existingEnrollment != null)
            {
                return BadRequest("Enrollment already exists for this course and student.");
            }

            // 檢查課程是否存在
            var course = _context.Course.Find(value.CourseId);
            if (course == null)
            {
                return NotFound("Course not found.");
            }

            // 檢查課程是否已達最大人數限制
            if (course.MaxStudent.HasValue)
            {
                int currentEnrollments = _context.Enrollment.Count(e => e.CourseId == value.CourseId);
                if (currentEnrollments >= course.MaxStudent.Value)
                {
                    return BadRequest("Course has reached its maximum enrollment capacity.");
                }
            }

            var result = new Enrollment
            {
                CourseId = value.CourseId,
                StudentId = value.StudentId,
                EnrollmentDate = DateTime.Now,
                StatusId = 1,
                UpdatedDate = DateTime.Now
            };

            _context.Enrollment.Add(result);
            _context.SaveChanges();
            return CreatedAtAction(nameof(EnrollmentPost), new { id = result.EnrollmentId, courseId = result.CourseId }, value);
        }

        // 取消報名課程
        // DELETE api/enrollment/CancelEnroll
        [HttpDelete("CancelEnroll")]
        [Authorize(Roles = "Student")]
        public IActionResult EnrollmentDelete([FromBody] EnrollDto value)
        {
            var result = _context.Enrollment.FirstOrDefault(e => e.CourseId == value.CourseId && e.StudentId == value.StudentId);
            if (result == null)
            {
                return NotFound("Enrollment or student not found.");
            }
            _context.Enrollment.Remove(result);
            _context.SaveChanges();
            return Ok("Enrollment deleted successfully.");
        }

        // 重新報名 退選後的課程會被標記為已退選->狀態改為報名
        // PUT api/enrollment/reEnroll
        [HttpPut("ReEnroll")]
        [Authorize(Roles = "Student")]
        public IActionResult ReEnroll([FromBody] EnrollDto value)
        {
            var existingEnrollment = _context.Enrollment.FirstOrDefault(e =>
                e.CourseId == value.CourseId && e.StudentId == value.StudentId);
            if (existingEnrollment != null)
            {
                // 如果已經報名，則更新狀態為報名
                existingEnrollment.StatusId = 1;
                existingEnrollment.UpdatedDate = DateTime.Now;
                _context.SaveChanges();
                return Ok("Re-enrollment successful.");
            }
            else
            {
                return NotFound("Enrollment not found for the specified course and student.");
            }
        }

        // 根據 CourseId or studentId 查詢該課程的報名學生表
        // GET api/enrollment/courseId/{courseId}
        [HttpGet]
        [Authorize]
        public IActionResult EnrollmentGet([FromQuery] int? courseId, [FromQuery] int? studentId)
        {
            var query = _context.Enrollment.AsQueryable();

            if (courseId.HasValue)
                query = query.Where(e => e.CourseId == courseId.Value);

            if (studentId.HasValue)
                query = query.Where(e => e.StudentId == studentId.Value);

            var result = query
                .Select(e => new EnrollmentDto
                {
                    EnroollmentId = e.EnrollmentId,
                    CourseId = e.CourseId,
                    FullName = $"{e.Student.FirstName} {e.Student.LastName}",
                    EnrollmentDate = e.EnrollmentDate ?? DateTime.Now,
                    StatusId = e.StatusId,
                    StatusName = e.Status.StatusName,
                    Grade = e.Grade,
                    Comments = e.Comments,
                    UpdatedDate = e.UpdatedDate ?? DateTime.Now
                })
                .ToList();

            return Ok(result);
        }
    }
}