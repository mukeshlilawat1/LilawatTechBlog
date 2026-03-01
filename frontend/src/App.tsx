import "./App.css";
import { Helmet } from "react-helmet-async";
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
import MyPostsPage from "./pages/Mypostspage";
import AdminDashboard from "./pages/Admindashboard";
import NotesPage from "./pages/Notespage";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Footer from "./components/Footer";
import OAuth2Callback from "./pages/OAuth2Callback";
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0b",
      }}
    >
      {/* ═══════════════════════════════════════════ */}
      {/* GLOBAL SEO — Har page pe apply hoga        */}
      {/* Page-specific tags in individual pages     */}
      {/* ═══════════════════════════════════════════ */}
      <Helmet>
        {/* Default Title — Pages apna title override karenge */}
        <title>Lilawat Tech Blog | Mukesh Lilawat</title>
        <meta name="title" content="Lilawat Tech Blog | Mukesh Lilawat" />
        <meta
          name="description"
          content="Lilawat Tech Blog by Mukesh Lilawat — Full-Stack Developer & AI/ML Enthusiast from Rajasthan, India. In-depth articles on Spring Boot, React, Java, and Web Development."
        />
        <meta
          name="keywords"
          content="Mukesh Lilawat, mukesh lilawat blog, lilawat tech blog, lilawattechblog, spring boot tutorials, react tutorials, java development, full stack developer india, AI ML, web development, backend developer rajasthan"
        />
        <meta name="author" content="Mukesh Lilawat" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        <meta name="copyright" content="Mukesh Lilawat" />
        <meta name="owner" content="Mukesh Lilawat" />
        <meta
          name="category"
          content="Technology, Programming, Web Development"
        />
        <meta name="classification" content="Technology Blog" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <link rel="canonical" href="https://lilawattechblog.in" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lilawattechblog.in/" />
        <meta
          property="og:title"
          content="Lilawat Tech Blog | Mukesh Lilawat"
        />
        <meta
          property="og:description"
          content="In-depth articles on Spring Boot, React, Java, and AI/ML by Mukesh Lilawat — Full-Stack Developer from Rajasthan, India."
        />
        <meta
          property="og:image"
          content="https://lilawattechblog.in/og-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Lilawat Tech Blog by Mukesh Lilawat"
        />
        <meta property="og:site_name" content="Lilawat Tech Blog" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mukeshlilawat11" />
        <meta name="twitter:creator" content="@mukeshlilawat11" />
        <meta
          name="twitter:title"
          content="Lilawat Tech Blog | Mukesh Lilawat"
        />
        <meta
          name="twitter:description"
          content="In-depth articles on Spring Boot, React, Java, and AI/ML by Mukesh Lilawat."
        />
        <meta
          name="twitter:image"
          content="https://lilawattechblog.in/og-image.png"
        />

        {/* Schema — Blog */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Lilawat Tech Blog",
            "url": "https://lilawattechblog.in",
            "description": "In-depth articles on Spring Boot, React, Java, Web Development and AI/ML",
            "inLanguage": "en-IN",
            "author": {
              "@type": "Person",
              "name": "Mukesh Lilawat",
              "url": "https://mukeshlilawat.online",
              "jobTitle": "Full-Stack Developer",
              "sameAs": [
                "https://linkedin.com/in/mukeshlilawat1",
                "https://github.com/mukeshlilawat1",
                "https://twitter.com/mukeshlilawat11",
                "https://instagram.com/mukeshlilawat1",
                "https://medium.com/@mukeshkumarlilawat1",
                "https://mukeshlilawat.online"
              ]
            },
            "publisher": {
              "@type": "Organization",
              "name": "Lilawat Tech Blog",
              "url": "https://lilawattechblog.in",
              "logo": {
                "@type": "ImageObject",
                "url": "https://lilawattechblog.in/logo.png"
              }
            }
          }
        `}</script>

        {/* Schema — Person */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Mukesh Lilawat",
            "alternateName": ["Mukesh Kumar Lilawat", "mukeshlilawat1", "mukesh lilawat developer"],
            "url": "https://mukeshlilawat.online",
            "image": "https://lilawattechblog.in/mukesh-lilawat.jpg",
            "jobTitle": "Full-Stack Developer",
            "description": "Full-Stack Developer & AI/ML Enthusiast from Rajasthan, India. Expert in Spring Boot, React, Java.",
            "worksFor": {
              "@type": "Organization",
              "name": "Freelance"
            },
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "Rajasthan",
              "addressCountry": "India"
            },
            "knowsAbout": [
              "Spring Boot", "React", "Java", "AI/ML",
              "Web Development", "Full-Stack Development",
              "REST API", "Microservices", "PostgreSQL"
            ],
            "sameAs": [
              "https://linkedin.com/in/mukeshlilawat1",
              "https://github.com/mukeshlilawat1",
              "https://twitter.com/mukeshlilawat11",
              "https://instagram.com/mukeshlilawat1",
              "https://medium.com/@mukeshkumarlilawat1",
              "https://mukeshlilawat.online"
            ]
          }
        `}</script>

        {/* Schema — WebSite with SearchAction */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Lilawat Tech Blog",
            "alternateName": "lilawattechblog",
            "url": "https://lilawattechblog.in",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://lilawattechblog.in/posts?search={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          }
        `}</script>

        {/* Schema — BreadcrumbList */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://lilawattechblog.in"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Posts",
                "item": "https://lilawattechblog.in/posts"
              }
            ]
          }
        `}</script>
      </Helmet>

      <NavBar
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onLogout={logout}
        userProfile={{ name: profile?.name || "User" }}
      />

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:id" element={<PostPage />} />

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

          {/* Authenticated */}
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
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <NotesPage />
              </ProtectedRoute>
            }
          />
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

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
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
      </main>

      <Footer />
    </div>
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
