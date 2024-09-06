import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { apiRequest } from './api';

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { login } = authContext;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest('/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (rememberMe) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      login(data.token, data.refreshToken);
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="auth">
      <form className="auth__form" onSubmit={handleLogin}>
        <h2 className="auth__title">Welcome Back</h2>
        <p className="auth__subtitle">Please login to your account</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading && <p>Loading...</p>}
        <div className="auth__input-group">
          <label htmlFor="email" className="auth__label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="auth__input"
            placeholder="Enter your email"
            value={email}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </div>
        <div className="auth__input-group">
          <label htmlFor="password" className="auth__label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="auth__input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="auth__remember-me">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            className="auth__checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
          />
          <label htmlFor="remember" className="auth__checkbox-label">Remember me</label>
        </div>

        <button type="submit" className="auth__button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="auth__options">
          <a href="#" className="auth__link">Forgot Password?</a>
          <a href="/register" className="auth__link">Create Account</a>
        </div>

        <div className="auth__social-login">
          <p className="auth__social-text">Or login with</p>
          <div className="auth__social-buttons">
            <button type="button" className="auth__social-button auth__social-button--google">
              <i className="fab fa-google"></i> Google
            </button>
            <button type="button" className="auth__social-button auth__social-button--github">
              <i className="fab fa-github"></i> GitHub
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
