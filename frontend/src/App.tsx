import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import AdminLayout from "./layouts/AdminLayout";
import Students from "./pages/admin/Students/Students";
import Courses from "./pages/admin/Courses/Courses";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route path="courses" element={<Courses />} />
          <Route path="students" element={<Students />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
