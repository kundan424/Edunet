# EdTech Platform 🎓

A modern, editorial-style E-Learning platform built to provide a distraction-free, focused educational experience. The platform supports three primary user roles (Students, Instructors, and Admins) and features a comprehensive course building engine, an interactive learning workspace, and secure payment processing.

---

## 🌟 Key Features

### 🏢 Public & Landing Experience
* **Editorial Design System**: A strict, Bauhaus-inspired geometric design language focused on deep learning without clutter.
* **Course Catalog & Discovery**: Browse published courses with robust search, filtering (category, difficulty), and pagination.
* **Course Detail Pages**: Comprehensive breakdowns of course curriculums, instructor profiles, pricing, and reviews.
* **Information Pages**: Built-in support for About, Contact, Terms of Service, and Privacy Policy.

### 🎓 Student Experience
* **Authentication**: Secure Login/Registration with role-based JWT access.
* **My Learning Dashboard**: A dedicated workspace tracking enrolled courses, progress, and upcoming assignments.
* **Interactive Learning Engine**:
  * **Lessons**: Text and video-based content delivery.
  * **Quizzes**: Auto-graded assessments with immediate feedback.
  * **Assignments**: Project-based submissions that instructors review and grade.
* **Seamless Payments**: Full Stripe integration for purchasing premium courses (Success/Cancel workflows).
* **Student Profiles**: Manage personal information and track learning milestones.
* **Notifications**: Real-time alerts for graded assignments, course updates, and account events.

### 👨‍🏫 Instructor Experience
* **Instructor Dashboard**: High-level overview of total students, earnings, and course engagement.
* **Course Builder**: A comprehensive drafting environment for creating courses. 
* **Curriculum Editor**: Drag-and-drop or structured creation of Sections and Lessons.
* **Assessment Editors**: 
  * **Quiz Builder**: Create multiple-choice questions and set passing criteria.
  * **Assignment Builder**: Define project requirements and rubrics.
* **Submission Grading**: Review student assignments, provide feedback, and assign grades.
* **Moderation Workflow**: Submit drafted courses for Admin approval before they go live on the public catalog.

### 🛡️ Admin Experience
* **Admin Hub**: Global bird's-eye view of platform activity, recent signups, and financial metrics.
* **Course Moderation**: Review `PENDING_APPROVAL` courses. Inspect the deep curriculum (lessons, quizzes) and either Approve or Reject them.
* **Instructor Verification**: Review and approve applications from users wanting to become instructors.
* **Platform Activity**: Unified feed of recent enrollments, course creations, and systemic events.

---

## 🛠️ Tech Stack

### Frontend
* **Framework**: React 18
* **Language**: TypeScript
* **Routing**: React Router (v6) with Protected/Role-based Route Guards
* **State Management & Data Fetching**: TanStack React Query (`@tanstack/react-query`), Axios
* **Styling**: Tailwind CSS v4 (Custom UI components, zero-elevation flat design)
* **Icons**: Lucide React
* **Build Tool**: Vite

### Backend (Context)
* **Framework**: Spring Boot (Java)
* **Database**: PostgreSQL
* **Payments**: Stripe API
* **Security**: JWT-based Authentication

---

## 🔗 Environments & URLs

* **Frontend Application**: (Local: `http://localhost:5173`)
* **Backend Application / Repository**: Located locally at `e:\projects\E-learning`
* **Production Backend API**: `https://edtech-g1wd.onrender.com`

---

---

## 📁 Frontend Project Structure

```text
src/
├── app/               # App-wide configurations (Router setup)
├── auth/              # Auth context, JWT handling, login state
├── components/        # Shared UI Components
│   ├── course/        # Course cards, curriculum displays
│   ├── home/          # Modular landing page sections (Hero, Featured, Testimonials)
│   ├── info/          # Information page layouts (About, Terms)
│   └── ui/            # Base elements (Buttons, Typography, States)
├── features/          # Domain-specific logic, types, and API hooks
│   ├── admin/         # Moderation queries and types
│   ├── assignment/    # Assignment fetching and grading logic
│   ├── courses/       # Course discovery and management
│   ├── instructor/    # Instructor analytics and tools
│   ├── notifications/ # Polling and alert management
│   └── quiz/          # Quiz taking and authoring logic
├── layouts/           # Page wrappers (Public, Authenticated, Sidebar layouts)
├── pages/             # Route-level components
│   ├── admin/         # Admin dashboards and moderation views
│   ├── auth/          # Login, Register
│   ├── info/          # Static information pages
│   ├── instructor/    # Course creation and dashboard pages
│   ├── payment/       # Stripe success/cancel handlers
│   ├── public/        # Course catalog, detail pages
│   └── student/       # My Learning and workspace pages
└── lib/               # Utilities (Axios interceptors, formatting)
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+ recommended)
* npm or yarn

### Installation
1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Create a `.env` file in the root and add your backend API URL and Stripe public key:
   ```env
   VITE_API_URL=http://localhost:8080
   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. To build for production:
   ```bash
   npm run build
   ```
