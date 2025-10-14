import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import AdminLayout from "./layouts/AdminLayout";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="admin" element={<AdminLayout />}>
          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
