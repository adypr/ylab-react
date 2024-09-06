import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from './api';

const MIN_PASSWORD_LENGTH = 8;

const RegisterForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { login } = authContext;
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setLoading(false);
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      return;
    }

    const userName = name || 'User';

    try {
      const requestBody = { name: userName, email, password };

      const responseData = await apiRequest('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (responseData) {
        setMessage('Registration successful! Signing in...');

        const signinData = await apiRequest('/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (signinData) {
          localStorage.setItem('userName', userName);
          login(signinData.token, signinData.refreshToken);
          navigate('/dashboard');
        } else {
          setError('Signin failed after registration');
        }
      }
    } catch (err) {
      console.error('Failed to connect to server:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="auth">
      <form className="auth__form" onSubmit={handleRegister}>
        <h2 className="auth__title">Create Account</h2>
        <p className="auth__subtitle">Please register to create your account</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {loading && <p>Loading...</p>}

        <div className="auth__input-group">
          <label htmlFor="name" className="auth__label">Name (optional):</label>
          <input
            type="text"
            name="name"
            className="auth__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="auth__input-group">
          <label htmlFor="email" className="auth__label">Email:</label>
          <input
            type="email"
            name="email"
            className="auth__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="auth__input-group">
          <label htmlFor="password" className="auth__label">Password:</label>
          <input
            type="password"
            name="password"
            className="auth__input"
            value={password}
            onChange={handlePasswordChange}
            required
            disabled={loading}
          />
        </div>

        <div className="auth__remember-me">
          <input
            type="checkbox"
            name="remember"
            className="auth__checkbox"
            disabled={loading}
          />
          <label htmlFor="remember" className="auth__checkbox-label">Remember me</label>
        </div>

        <button type="submit" className="auth__button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="auth__options auth__options_single">
          <a href="/login" className="auth__link">Already have an account? Login</a>
        </div>

        <div className="auth__social-login">
          <p className="auth__social-text">Or register with</p>
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

export default RegisterForm;
