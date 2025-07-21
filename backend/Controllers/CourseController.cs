using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using student_information_system.Dtos;
using student_information_system.Models;

namespace student_information_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly Std_info_sysContext _context;
        public CourseController(Std_info_sysContext std_Info_SysContext)
        {
            _context = std_Info_SysContext;
        }

        // 獲取課程表 根據條件搜尋和分頁
        // GET: api/Course
        [HttpGet]
        [Authorize]
        public IActionResult GetCourses([FromQuery] int page = 1, [FromQuery] int pageSize = 10,
                                      [FromQuery] string? search = null,
                                      [FromQuery] int? teacherId = null, // 若傳入教師userid則 篩選該教師課程
                                      [FromQuery] int? studentId = null) // 若傳入學生userId則 多回傳一個該學生報名狀態
        {
            // 修改查詢以包含 Teacher 關聯
            var query = _context.Course.Include(c => c.Teacher).AsQueryable();

            // 套用搜尋條件
            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();
                query = query.Where(c =>
                    c.CourseName.ToLower().Contains(search) ||
                    (c.Description != null && c.Description.ToLower().Contains(search)) ||
                    (c.Teacher.FirstName != null && c.Teacher.FirstName.ToLower().Contains(search)) ||
                    (c.Teacher.LastName != null && c.Teacher.LastName.ToLower().Contains(search))

                );
            }

            // 套用teacherId條件
            if (teacherId.HasValue)
            {
                query = query.Where(c => c.TeacherId == teacherId);
            }

            // 計算總記錄數
            int totalItems = query.Count();
            int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            // 套用分頁
            var result = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new CourseDto
                {
                    CourseId = c.CourseId,
                    CourseName = c.CourseName,
                    Description = c.Description,
                    Credits = c.Credits,
                    TeacherId = c.TeacherId,
                    TeacherName = string.IsNullOrEmpty(c.Teacher.FirstName) && string.IsNullOrEmpty(c.Teacher.LastName)
                        ? c.Teacher.Username
                        : $"{c.Teacher.FirstName} {c.Teacher.LastName}".Trim(),
                    MaxStudent = c.MaxStudent,
                    EnrolledCount = _context.Enrollment.Count(e => e.CourseId == c.CourseId && e.StatusId == 1),
                    IsEnrollable = c.IsEnrollable,
                    StudentEnrollStatus = studentId.HasValue
                        ? _context.Enrollment
                            .Where(e => e.CourseId == c.CourseId && e.StudentId == studentId.Value)
                            .Select(e => new StudentEnrollStatusDto
                            {
                                StatusId = e.StatusId,
                                StatusName = e.Status.StatusName
                            })
                            .FirstOrDefault()
                        : null
                })
                .ToList();

            return Ok(new
            {
                courses = result,
                pagination = new
                {
                    total = totalItems,
                    currentPage = page,
                    pageSize = pageSize,
                    totalPages = totalPages
                }
            });
        }


        // 新增課程
        // POST api/Course
        [HttpPost]
        [Authorize(Roles = "Teacher,Admin")]
        public IActionResult CoursePost([FromBody] CourseDto value)
        {
            var course = new Course
            {
                CourseName = value.CourseName,
                Description = value.Description,
                Credits = value.Credits,
                TeacherId = value.TeacherId,
                MaxStudent = value.MaxStudent,
                IsEnrollable = value.IsEnrollable
            };

            _context.Course.Add(course);
            _context.SaveChanges();
            return CreatedAtAction(nameof(CoursePost), new { id = course.CourseId }, course);
        }



        // 更新課程
        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher,Admin")]
        public IActionResult CoursePut(int id, [FromBody] CourseDto value)
        {
            var course = _context.Course.Where(c => c.CourseId == id)
                .FirstOrDefault();
            if (course == null)
            {
                return NotFound();
            }
            course.CourseName = value.CourseName;
            course.Description = value.Description;
            course.Credits = value.Credits;
            course.TeacherId = value.TeacherId;
            course.MaxStudent = value.MaxStudent;
            course.IsEnrollable = value.IsEnrollable;
            _context.Course.Update(course);
            _context.SaveChanges();
            return NoContent();
        }

        // 刪除課程
        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher,Admin")]
        public IActionResult CourseDelete(int id)
        {
            var course = _context.Course.Where(c => c.CourseId == id)
                .FirstOrDefault();
            if (course == null)
            {
                return NotFound();
            }
            _context.Course.Remove(course);
            _context.SaveChanges();
            return NoContent();

        }
    }
}
