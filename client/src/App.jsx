import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Role from "./pages/Role";
import ContentManagement from "./pages/ContentManagement";
import CustomerManagement from "./pages/CustomerManagement";
import HomeService from "./pages/HomeService";
import MarketPlace from "./pages/MarketPlace";
import Settings from "./pages/Settings";
import ShowcaseManagement from "./pages/ShowcaseManagement ";
import UserManagement from "./pages/UserManagement";
import ProtectedRoute from "./Route/ProtectedRoute"; // Import ProtectedRoute

const App = () => {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
          <Route path="/role-management" element={<ProtectedRoute element={Role} />} />
          <Route path="/content-management" element={<ProtectedRoute element={ContentManagement} />} />
          <Route path="/customer-management" element={<ProtectedRoute element={CustomerManagement} />} />
          <Route path="/home-service" element={<ProtectedRoute element={HomeService} />} />
          <Route path="/market-place" element={<ProtectedRoute element={MarketPlace} />} />
          <Route path="/settings" element={<ProtectedRoute element={Settings} />} />
          <Route path="/showcase-management" element={<ProtectedRoute element={ShowcaseManagement} />} />
          <Route path="/user-management" element={<ProtectedRoute element={UserManagement} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
