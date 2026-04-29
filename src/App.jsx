import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Registration from './Pages/Registration';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';

import PrivateRoute from './Middleware/PrivateRoute';
import PublicRoute from './Middleware/PublicRoute';
import WebhookDetails from './Pages/WebhookDetails';
import NotificationSettings from './Pages/NotificationSettings';
import LandingPage from './Pages/LandingPage';
import PricingPage from './Pages/PricingPage';
import Documentation from './Pages/Documentation';

function App() {
  return (
    <Router>
      <Routes>

        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/docs"
          element={
            <PublicRoute>
              <Documentation />
            </PublicRoute>
          }
        />
        <Route
          path="/pricing"
          element={
            <PublicRoute>
              <PricingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Registration />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/log_details/:webhook_id"
          element={
            <PrivateRoute>
              <WebhookDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/communications/config"
          element={
            <PrivateRoute>
              <NotificationSettings />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;