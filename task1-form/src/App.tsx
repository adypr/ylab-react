import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import RegisterForm from './RegisterForm';
import Dashboard from './Dashboard';
import { AuthProvider, AuthContext } from './AuthContext';

import './App.scss';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

const AuthPage: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <Navigate to="/login" />;
  }

  const { isAuthenticated } = authContext;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <AuthForm />;
};

const RegisterPage: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <Navigate to="/login" />;
  }

  const { isAuthenticated } = authContext;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <RegisterForm />;
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <Navigate to="/login" />;
  }

  const { isAuthenticated } = authContext;

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default App;
