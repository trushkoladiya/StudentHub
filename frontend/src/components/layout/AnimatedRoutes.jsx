import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from '../auth/ProtectedRoute';

// Auth pages
import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';

// App pages
import Dashboard from '../../pages/Dashboard';
import Notes from '../../pages/Notes';
import Forum from '../../pages/Forum';
import Profile from '../../pages/Profile';
import QuestionDetail from '../../pages/QuestionDetail';

// New luxury pages
import TaskTracker from '../../pages/TaskTracker';
import Pomodoro from '../../pages/Pomodoro';
import Flashcards from '../../pages/Flashcards';

// Layout
import Layout from './Layout';
import PageTransition from './PageTransition';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <Notes />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <TaskTracker />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pomodoro"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <Pomodoro />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/flashcards"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <Flashcards />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <Forum />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <QuestionDetail />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <Profile />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
