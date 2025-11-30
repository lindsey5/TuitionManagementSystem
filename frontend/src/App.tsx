import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import AdminLayout from "./layouts/AdminLayout";
import Students from "./pages/Students";
import Courses from "./pages/admin/Courses";
import Subjects from "./pages/admin/Subjects";
import StudentSubjects from "./pages/StudentSubjects";
import Payments from "./pages/Payments";
import Dashboard from "./pages/admin/Dashboard";
import { UserContextProvider } from "./contexts/UserContext";
import StudentLayout from "./layouts/StudentLayout";
import StudentEnrolledSubjects from "./pages/student/StudentEnrolledSubject";
import StudentPayments from "./pages/student/StudentPayments";
import ProfileSettings from "./components/ui/ProfileSettings";
import Registrars from "./pages/admin/Registrars";
import RegistrarLayout from "./layouts/RegistrarLayout";
import OverdueStudents from "./pages/Overdues";

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
            <Route path="registrars" element={<Registrars />} />
            <Route path="overdues" element={<OverdueStudents />} />
            <Route path="profile" element={<ProfileSettings<Admin> profileApiUrl="/api/admins" passwordApiUrl="/api/admins/password"/>} />
          </Route>

          <Route path="student" element={<StudentLayout />}>
            <Route index element={<StudentEnrolledSubjects />}/>
            <Route path="payments" element={<StudentPayments />} />
            <Route path="profile" element={<ProfileSettings<Student> profileApiUrl="/api/students" passwordApiUrl="/api/students/password"/>} />
          </Route>

          <Route path="registrar" element={<RegistrarLayout />}>
            <Route index element={<Subjects />} />
            <Route path="students" element={<Students />} />
            <Route path="student-subjects/:id" element={<StudentSubjects />} />
            <Route path="payments" element={<Payments />} />
            <Route path="profile" element={<ProfileSettings<Admin> profileApiUrl="/api/registrars" passwordApiUrl="/api/registrars/password"/>} />
            <Route path="overdues" element={<OverdueStudents />} />
          </Route>


          <Route path="*" element={<Navigate to='/'/>}/>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  )
}

export default App
