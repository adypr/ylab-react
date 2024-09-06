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
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {loading && <p>Loading...</p>}
      <div>
        <label>Name (optional):</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
          disabled={loading}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;
