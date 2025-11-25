import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import AdminLayout from "./layouts/AdminLayout";
import Students from "./pages/admin/Students";
import Courses from "./pages/admin/Courses";
import Subjects from "./pages/admin/Subjects";
import StudentSubjects from "./pages/admin/StudentSubjects";
import Payments from "./pages/admin/Payments";
import Dashboard from "./pages/admin/Dashboard";

function App() {

  return (
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
