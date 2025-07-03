import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login({ setUser }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    setUser({ name, role });
    navigate('/manage');
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>🔐 Login to VIT SWC Portal</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin (SWC)</option>
          <option value="president">Club President</option>
          <option value="faculty">Faculty Coordinator</option>
        </select>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
