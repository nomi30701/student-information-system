import React, { useEffect, useState } from "react";
import { getCourses } from "../services/courseService";
import CourseCard from "../components/courses/CourseCard";
import { Container, Row, Col } from "react-bootstrap";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container>
      <h1 className="my-4">Available Courses</h1>
      <Row>
        {courses.map((course) => (
          <Col key={course.CourseID} md={4} className="mb-4">
            <CourseCard course={course} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CoursesPage;
