import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { StudentLayout } from '../components/layout/StudentLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

// Public Pages
import { Home } from '../pages/public/Home';
import { Courses } from '../pages/public/Courses';
import { CourseDetails } from '../pages/public/CourseDetails';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';

// Student Pages
import { Dashboard } from '../pages/student/Dashboard';
import { MyCourses } from '../pages/student/MyCourses';
import { Classroom } from '../pages/student/Classroom';
import { QuizPage } from '../pages/student/QuizPage';
import { CertificateView } from '../pages/student/CertificateView';
import { Profile } from '../pages/student/Profile';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminCourses } from '../pages/admin/AdminCourses';
import { AdminCourseEdit } from '../pages/admin/AdminCourseEdit';
import { AdminStudents } from '../pages/admin/AdminStudents';
import { AdminQuizzes } from '../pages/admin/AdminQuizzes';
import { AdminCategories } from '../pages/admin/AdminCategories';

// Public Layout Wrapper with Navbar and Footer
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:slug" element={<CourseDetails />} />
        <Route path="/certificates/:code" element={<CertificateView />} />
      </Route>

      {/* 2. Auth Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* 3. Student Portal (Protected) */}
      <Route
        element={
          <ProtectedRoute>
            <PublicLayout />
          </ProtectedRoute>
        }
      >
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/courses" element={<MyCourses />} />
          <Route path="/dashboard/certificates" element={<CertificateView />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* 4. Classroom / LMS Player (Immersive Full Screen) */}
      <Route
        path="/learn/:courseSlug/:lessonSlug"
        element={
          <ProtectedRoute>
            <Classroom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/:id"
        element={
          <ProtectedRoute>
            <PublicLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<QuizPage />} />
      </Route>

      {/* 5. Admin Portal (Protected for Admin role) */}
      <Route
        element={
          <AdminRoute>
            <PublicLayout />
          </AdminRoute>
        }
      >
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/courses/new" element={<AdminCourseEdit />} />
          <Route path="/admin/courses/:id/edit" element={<AdminCourseEdit />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/quizzes" element={<AdminQuizzes />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
