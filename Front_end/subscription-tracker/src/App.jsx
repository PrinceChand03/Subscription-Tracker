import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import CreateSubscription from './pages/ CreateSubscription';
import EditSubscription from './pages/EditSubscription';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage when app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* ✅ Default route: if user, go to dashboard */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        <Route path="/login" element={<SignIn setUser={setUser} />} />
        <Route path="/signup" element={<SignUp />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-subscription"
          element={
            <ProtectedRoute user={user}>
              <CreateSubscription />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription/:id/edit"
          element={
            <ProtectedRoute user={user}>
              <EditSubscription />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
