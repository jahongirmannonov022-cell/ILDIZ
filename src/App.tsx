import { lazy, ReactNode, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useApp } from './store/AppContext';
import AppLayout from './components/AppLayout';
import { BadgeModal, Toasts } from './components/Overlays';
import { SkeletonCards } from './components/ui';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import ParentDashboard from './pages/ParentDashboard';
import Tutors from './pages/Tutors';
import Session from './pages/Session';
import GardenVisit from './pages/GardenVisit';
import Scan from './pages/Scan';
import LessonPage from './pages/Lesson';
import KnowledgeMap from './pages/KnowledgeMap';
import ParentReport from './pages/ParentReport';
import Grandma from './pages/Grandma';
import Teacher from './pages/Teacher';
import Assistant from './pages/Assistant';
import Achievements from './pages/Achievements';
import Community from './pages/Community';
import Impact from './pages/Impact';
import Notifications from './pages/Notifications';
import SettingsPage from './pages/Settings';
import NotFound from './pages/NotFound';

// Leaflet is heavy — load the map page on demand
const SchoolsMap = lazy(() => import('./pages/SchoolsMap'));

function RequireAuth({ children, onboarded = true }: { children: ReactNode; onboarded?: boolean }) {
  const { state } = useApp();
  if (!state) return <Navigate to="/login" replace />;
  if (onboarded && !state.profile.onboarded) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

/** Each platform has its own home page */
function HomeByRole() {
  const { state } = useApp();
  const role = state?.profile.role;
  return role === 'parent' ? <ParentDashboard /> : role === 'teacher' ? <Teacher /> : <Dashboard />;
}

export default function App() {
  const { settings } = useApp();
  const location = useLocation();
  const top = location.pathname.startsWith('/app') ? '/app' : location.pathname;
  return (
    <MotionConfig reducedMotion={settings.lite ? 'always' : 'user'}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={top}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/impact" element={<Impact standalone />} />
          <Route
            path="/onboarding"
            element={
              <RequireAuth onboarded={false}>
                <Onboarding />
              </RequireAuth>
            }
          />
          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route index element={<HomeByRole />} />
            <Route path="tutors" element={<Tutors />} />
            <Route path="session/:id" element={<Session />} />
            <Route path="gardens/:id" element={<GardenVisit />} />
            <Route path="scan" element={<Scan />} />
            <Route path="lesson/:id" element={<LessonPage />} />
            <Route path="map" element={<KnowledgeMap />} />
            <Route path="parent" element={<ParentReport />} />
            <Route path="grandma" element={<Grandma />} />
            <Route path="teacher" element={<Teacher />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="community" element={<Community />} />
            <Route
              path="schools"
              element={
                <Suspense fallback={<SkeletonCards n={3} h="h-72" />}>
                  <SchoolsMap />
                </Suspense>
              }
            />
            <Route path="impact" element={<Impact />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound inApp />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Toasts />
      <BadgeModal />
    </MotionConfig>
  );
}
