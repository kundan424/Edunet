import { createBrowserRouter } from 'react-router-dom';
import { PublicRoute, RoleRoute } from '../routes/guards';
import { PublicLayout, AuthenticatedLayout } from '../layouts';
import { Home } from '../pages/Home';
import { Courses } from '../pages/public/Courses';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { CourseDetail } from '../pages/public/CourseDetail';
import { MyLearning } from '../pages/student/MyLearning';
import { LearningWorkspace } from '../pages/student/LearningWorkspace';

import { RouteErrorBoundary } from '../components/ui/RouteErrorBoundary';
import { NotificationsPage } from '../pages/shared/NotificationsPage';
import { PaymentSuccess } from '../pages/payment/PaymentSuccess';
import { PaymentCancel } from '../pages/payment/PaymentCancel';
import { Profile } from '../pages/profile/Profile';

// Instructor pages
import { InstructorDashboard } from '../pages/instructor/InstructorDashboard';
import { InstructorCourses } from '../pages/instructor/InstructorCourses';
import { CreateCourse } from '../pages/instructor/CreateCourse';
import { CourseEditor } from '../pages/instructor/CourseEditor';
import { QuizEditor } from '../pages/instructor/QuizEditor';
import { AssignmentEditor } from '../pages/instructor/AssignmentEditor';

// Admin pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminInstructors } from '../pages/admin/AdminInstructors';
import { AdminCourses } from '../pages/admin/AdminCourses';
import { AdminCourseReview } from '../pages/admin/AdminCourseReview';
import { NotFound } from '../pages/shared/NotFound';

import { About } from '../pages/info/About';
import { Contact } from '../pages/info/Contact';
import { Terms } from '../pages/info/Terms';
import { Privacy } from '../pages/info/Privacy';

export const router = createBrowserRouter([
  // Public Routes
  {
    element: <PublicLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/courses', element: <Courses /> },
      { path: '/courses/:courseId', element: <CourseDetail /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/terms', element: <Terms /> },
      { path: '/privacy', element: <Privacy /> },
      { 
        element: <PublicRoute />, 
        children: [
          { path: '/login', element: <Login /> },
          { path: '/register', element: <Register /> },
        ] 
      }
    ]
  },
  
  // Student Authenticated Routes
  {
    element: <AuthenticatedLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '/notifications', element: <NotificationsPage /> },
      {
        element: <RoleRoute allowedRoles={['STUDENT']} />,
        children: [
          { path: '/learn', element: <MyLearning /> },
          { path: '/learn/:courseId', element: <LearningWorkspace /> },
          { path: '/courses/:courseId/payment/success', element: <PaymentSuccess /> },
          { path: '/courses/:courseId/payment/cancel', element: <PaymentCancel /> },
        ]
      }
    ]
  },

  // Instructor Authenticated Routes
  {
    element: <AuthenticatedLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <RoleRoute allowedRoles={['INSTRUCTOR']} />,
        children: [
          { path: '/instructor', element: <InstructorDashboard /> },
          { path: '/instructor/courses', element: <InstructorCourses /> },
          { path: '/instructor/courses/create', element: <CreateCourse /> },
          { path: '/instructor/courses/:courseId', element: <CourseEditor /> },
          { path: '/instructor/courses/:courseId/quiz/:lessonId', element: <QuizEditor /> },
          { path: '/instructor/courses/:courseId/assignment/:lessonId', element: <AssignmentEditor /> },
          { path: '/instructor/profile', element: <Profile /> },
        ]
      }
    ]
  },

  // Admin Authenticated Routes
  {
    element: <AuthenticatedLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <RoleRoute allowedRoles={['ADMIN']} />,
        children: [
          { path: '/admin', element: <AdminDashboard /> },
          { path: '/admin/instructors', element: <AdminInstructors /> },
          { path: '/admin/courses', element: <AdminCourses /> },
          { path: '/admin/courses/:courseId/review', element: <AdminCourseReview /> },
        ]
      }
    ]
  },
  
  // 404
  {
    path: '*',
    element: <PublicLayout />,
    children: [
      { path: '*', element: <NotFound /> }
    ]
  }
]);
