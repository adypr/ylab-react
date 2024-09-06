import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

const Dashboard: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  if (!authContext) {
    return null;
  }

  const { logout } = authContext;

  return (
    <div>
      <h1>Welcome, {userName || 'User'}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
