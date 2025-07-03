// 📁 src/components/ClubListPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ClubListPage({ clubs }) {
  const navigate = useNavigate();
  const [showMembers, setShowMembers] = useState(null); // index of club being shown

  const toggleMembers = (index) => {
    setShowMembers(showMembers === index ? null : index);
  };

  return (
    <div className="page">
      <h1>All Clubs</h1>
      <button onClick={() => navigate('/add')}>➕ Add New Club</button>
      <ul>
        {clubs.map((club, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <strong>{club.name}</strong>
            <button onClick={() => navigate(`/club/${index}`)}>🔧 Manage</button>
            <button onClick={() => toggleMembers(index)}>
              {showMembers === index ? '🙈 Hide Members' : '👁️ View Members'}
            </button>
            {showMembers === index && (
              <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                {club.members.length > 0 ? (
                  club.members.map((m, i) => <li key={i}>👤 {m}</li>)
                ) : (
                  <li>No members yet.</li>
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClubListPage;
