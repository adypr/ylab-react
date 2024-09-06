import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import avatar from './assets/images/avatar.png';

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
    <div className="dashboard">
      <div className="dashboard__avatar">
        <img
          src={avatar}
          alt="User Avatar"
          className="dashboard__avatar-image"
        />
      </div>
      <h1 className="dashboard__title">Welcome, {userName || 'User'}!</h1>
      <button className="dashboard__button" onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
