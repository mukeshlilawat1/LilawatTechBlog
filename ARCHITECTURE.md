# Architecture Documentation

This document explains the architecture of **LilawatTechBlog**, including the backend, frontend, and database design.

---

## Backend (Spring Boot)

* **RESTful APIs** for all CRUD operations
* **JWT Authentication** for secure access
* **Service Layer** handles business logic
* **Repository Layer** interacts with PostgreSQL database
* **Exception Handling** via custom exceptions

### Directory Structure

```
lilawattechblog-backend/
 ├─ controller/       # REST APIs
 ├─ service/          # Business logic
 ├─ repository/       # JPA Repositories
 ├─ model/            # Entity classes
 ├─ security/         # JWT, Filters, Auth
 └─ exception/        # Custom exceptions
```

---

## Frontend (React + Tailwind CSS)

* **SPA** with React Router for page navigation
* **Axios** or **fetch** for API calls to backend
* **Tailwind CSS** for responsive styling
* **Components:** Navbar, Footer, PostCard, CommentList, etc.

### Directory Structure

```
lilawattechblog-frontend/
 ├─ components/      # Reusable components
 ├─ pages/           # Home, BlogDetail, Login, Signup
 ├─ services/        # API services
 ├─ hooks/           # Custom React hooks
 └─ App.jsx          # Main app component
```

---

## Database Design (PostgreSQL)

* **users**: id, username, email, password_hash, role, created_at
* **posts**: id, title, content, author_id, created_at, updated_at
* **comments**: id, post_id, user_id, comment_text, created_at

**Relationships:**

* One User → Many Posts
* One Post → Many Comments

---

## JWT Flow

1. User logs in → backend validates credentials
2. Backend returns JWT token
3. Frontend stores token (localStorage/sessionStorage)
4. Protected API calls include JWT in Authorization header
5. Backend validates JWT for authorization

---

## Deployment

* **Dockerized backend and frontend**
* **PostgreSQL** containerized for easy setup
* Optional **Docker Compose** for running all services together
