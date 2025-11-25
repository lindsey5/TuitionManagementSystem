import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import AdminLayout from "./layouts/AdminLayout";
import Students from "./pages/admin/Students";
import Courses from "./pages/admin/Courses";
import Subjects from "./pages/admin/Subjects";
import StudentSubjects from "./pages/admin/StudentSubjects";
import Payments from "./pages/admin/Payments";
import Dashboard from "./pages/admin/Dashboard";
import { UserContextProvider } from "./contexts/UserContext";
import StudentLayout from "./layouts/StudentLayout";
import StudentEnrolledSubjects from "./pages/student/StudentEnrolledSubject";
import StudentPayments from "./pages/student/StudentPayments";

function App() {

  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<LoginPage />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="students" element={<Students />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="student-subjects/:id" element={<StudentSubjects />} />
            <Route path="payments" element={<Payments />} />
          </Route>

          <Route path="student" element={<StudentLayout />}>
            <Route index element={<StudentEnrolledSubjects />}/>
            <Route path="payments" element={<StudentPayments />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  )
}

export default App
