import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import StudentDashboard from "../components/dashboard/StudentDashboard";
import TeacherDashboard from "../components/dashboard/TeacherDashboard";

const DashboardPage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const renderDashboard = () => {
    switch (currentUser.roleName) {
      case "Admin":
        return <AdminDashboard />;
      case "Teacher":
        return <TeacherDashboard />;
      case "Student":
        return <StudentDashboard />;
      default:
        return <div>Unauthorized access</div>;
    }
  };

  return (
    <div className="container">
      <h1 className="my-4">Dashboard</h1>
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;
