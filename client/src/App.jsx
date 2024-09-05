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
import ShowcaseManagement from "./pages/ShowcaseManagement";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/404";
import { AuthProvider } from "./context/AuthContext";
import Protected from "./ProtectedRoute/protected";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Set default route to Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Protected />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/role-management" element={<Role />} />
            <Route path="/content-management" element={<ContentManagement />} />
            <Route path="/customer-management" element={<CustomerManagement />} />
            <Route path="/home-service" element={<HomeService />} />
            <Route path="/market-place" element={<MarketPlace />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/showcase-management" element={<ShowcaseManagement />} />
            <Route path="/user-management" element={<UserManagement />} />
          </Route>
          <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
