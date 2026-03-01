import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import EditPostPage from "./pages/EditPostPage";
import PostPage from "./pages/PostPage";
import CategoriesPage from "./pages/CategoriesPage";
import TagsPage from "./pages/TagsPage";
import DraftsPage from "./pages/DraftsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Profilepage from "./pages/Profilepage";
import MyPostsPage from "./pages/Mypostspage"; // ✅ NEW
import AdminDashboard from "./pages/Admindashboard"; // ✅ NEW
import NotesPage from "./pages/Notespage"; // ✅ NEW
import { AuthProvider, useAuth } from "./components/AuthContext";
import Footer from "./components/Footer";
import OAuth2Callback from './pages/OAuth2Callback';
import ForgotPasswordPage from "./pages/Forgotpasswordpage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function AppContent() {
  const { isAuthenticated, isAdmin, logout, profile } = useAuth();

  return (
    <>
      <NavBar
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onLogout={logout}
        userProfile={{ name: profile?.name || "User" }}
      />
      <main className="container mx-auto py-6">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/posts/:id"
            element={<PostPage isAuthenticated={isAuthenticated} />}
          />
          {/* Guest only */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />
          {/* Authenticated users */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profilepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-posts"
            element={
              <ProtectedRoute>
                <MyPostsPage />
              </ProtectedRoute>
            }
          />{" "}
          {/* ✅ NEW */}
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <NotesPage />
              </ProtectedRoute>
            }
          />{" "}
          {/* ✅ NEW */}
          <Route
            path="/posts/new"
            element={
              <ProtectedRoute>
                <EditPostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id/edit"
            element={
              <ProtectedRoute>
                <EditPostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/drafts"
            element={
              <ProtectedRoute>
                <DraftsPage />
              </ProtectedRoute>
            }
          />
          {/* Admin only */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />{" "}
          {/* ✅ NEW */}
          <Route
            path="/categories"
            element={
              <AdminRoute>
                <CategoriesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/tags"
            element={
              <AdminRoute>
                <TagsPage />
              </AdminRoute>
            }
          />
          <Route path="/oauth2/callback" element={<OAuth2Callback />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
        <Footer />
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
