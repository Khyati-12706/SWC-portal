import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc
} from 'firebase/firestore';

function App() {
  const [clubs, setClubs] = useState([]);
  const [user, setUser] = useState(null);
  const [loginName, setLoginName] = useState('');
  const [loginRole, setLoginRole] = useState('admin');
  const [selectedClub, setSelectedClub] = useState(null);
  const [viewMembersIndex, setViewMembersIndex] = useState(null);
  const [newClubName, setNewClubName] = useState('');
  const [newClubDescription, setNewClubDescription] = useState('');
  const [newClubCategory, setNewClubCategory] = useState('');
  const [newClubPresident, setNewClubPresident] = useState('');
  const [newClubFaculty, setNewClubFaculty] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [students] = useState([
    'Rahul', 'Priya', 'Anjali', 'Sneha', 'Amit', 'Sara', 'Vikram', 'Neha'
  ]);
  const [faculty] = useState([
    'Prof. Meena', 'Prof. Ramesh', 'Prof. Sharma', 'Prof. Gupta'
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editClubIndex, setEditClubIndex] = useState(null);
  const [editClubData, setEditClubData] = useState({ name: '', description: '', category: '', president: '', faculty: '' });
  const [showAddClubForm, setShowAddClubForm] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [memberInfo, setMemberInfo] = useState(null);

  // Firestore: Listen for real-time updates
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'clubs'), (snapshot) => {
      setClubs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleLogin = () => {
    let name = loginName.trim();
    if (!name) return alert('Enter your name');
    setUser({ name, role: loginRole });
    setLogoutMessage('');
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedClub(null);
    setLoginName('');
    setLoginRole('admin');
    setLogoutMessage('You have been logged out.');
  };

  const handleAddClub = async () => {
    if (!newClubName.trim() || !newClubDescription.trim() || !newClubCategory.trim() || !newClubPresident.trim() || !newClubFaculty.trim()) {
      return alert('Please fill all club details');
    }
    if (newClubPresident === newClubFaculty) return alert('President and Faculty cannot be the same');
    const exists = clubs.some(club => (club.name || '').toLowerCase() === newClubName.toLowerCase());
    if (exists) return alert('Club already exists!');
    await addDoc(collection(db, 'clubs'), {
      name: newClubName.trim(),
      description: newClubDescription.trim(),
      category: newClubCategory.trim(),
      president: newClubPresident,
      faculty: newClubFaculty,
      members: [newClubPresident],
    });
    setNewClubName('');
    setNewClubDescription('');
    setNewClubCategory('');
    setNewClubPresident('');
    setNewClubFaculty('');
  };

  const handleClubSelect = (index) => {
    setSelectedClub(index);
    setViewMembersIndex(null);
  };

  const toggleViewMembers = (index) => {
    setViewMembersIndex(viewMembersIndex === index ? null : index);
  };

  const assignPresident = async () => {
    if (!newClubPresident.trim()) return alert('Enter president name');
    if (newClubPresident.trim() === clubs[selectedClub].faculty)
      return alert('President and Faculty cannot be the same');
    const club = clubs[selectedClub];
    let updatedMembers = club.members;
    if (!updatedMembers.includes(newClubPresident)) {
      updatedMembers = [...updatedMembers, newClubPresident];
    }
    await updateDoc(doc(db, 'clubs', club.id), {
      president: newClubPresident,
      members: updatedMembers,
    });
    setNewClubPresident('');
  };

  const assignFaculty = async () => {
    if (!newClubFaculty.trim()) return alert('Enter faculty name');
    if (newClubFaculty.trim() === clubs[selectedClub].president)
      return alert('Faculty and President cannot be the same');
    const club = clubs[selectedClub];
    await updateDoc(doc(db, 'clubs', club.id), {
      faculty: newClubFaculty,
    });
    setNewClubFaculty('');
  };

  const addMember = async () => {
    if (!newMemberName.trim()) return;
    const club = clubs[selectedClub];
    if (!club.members.includes(newMemberName.trim())) {
      const updatedMembers = [...club.members, newMemberName.trim()];
      await updateDoc(doc(db, 'clubs', club.id), { members: updatedMembers });
    } else {
      alert('Member already exists');
    }
    setNewMemberName('');
  };

  const removeMember = async (name) => {
    const club = clubs[selectedClub];
    const updatedMembers = club.members.filter((m) => m !== name);
    await updateDoc(doc(db, 'clubs', club.id), { members: updatedMembers });
  };

  const handleEditClub = (index) => {
    const club = clubs[index];
    setEditClubIndex(index);
    setEditClubData({
      name: club.name,
      description: club.description,
      category: club.category,
      president: club.president,
      faculty: club.faculty,
    });
  };

  const handleEditClubChange = (field, value) => {
    setEditClubData({ ...editClubData, [field]: value });
  };

  const handleSaveEditClub = async () => {
    if (!editClubData.name.trim() || !editClubData.description.trim() || !editClubData.category.trim() || !editClubData.president.trim() || !editClubData.faculty.trim()) {
      return alert('Please fill all club details');
    }
    if (editClubData.president === editClubData.faculty) return alert('President and Faculty cannot be the same');
    const clubId = clubs[editClubIndex].id;
    const updatedMembers = clubs[editClubIndex].members.includes(editClubData.president)
      ? clubs[editClubIndex].members
      : [...clubs[editClubIndex].members, editClubData.president];
    await updateDoc(doc(db, 'clubs', clubId), {
      ...editClubData,
      members: updatedMembers,
    });
    setEditClubIndex(null);
  };

  const handleDeleteClub = async (index) => {
    if (window.confirm('Are you sure you want to delete this club?')) {
      const clubId = clubs[index].id;
      await deleteDoc(doc(db, 'clubs', clubId));
      if (selectedClub === index) setSelectedClub(null);
    }
  };

  const handleCancelEdit = () => setEditClubIndex(null);

  // Filtered clubs by category
  const filteredClubs = clubs.filter(club => {
    const term = searchTerm.toLowerCase();
    const categoryMatch = categoryFilter === 'All' || ((club.category || '').toLowerCase() === categoryFilter.toLowerCase());
    return (
      (club.name && club.name.toLowerCase().includes(term)) ||
      (club.description && club.description.toLowerCase().includes(term)) ||
      (club.category && club.category.toLowerCase().includes(term))
    ) && categoryMatch;
  });

  // Dashboard summary for all roles
  const totalClubs = filteredClubs.length;
  const totalMembers = clubs.reduce((sum, club) => sum + (club.members ? club.members.length : 0), 0);
  const categoryCounts = clubs.reduce((acc, club) => {
    acc[club.category] = (acc[club.category] || 0) + 1;
    return acc;
  }, {});

  // Filtered clubs for president (case-insensitive)
  const presidentClubs = user && user.role === 'president'
    ? clubs.filter(club => club.president && user.name && club.president.toLowerCase() === user.name.toLowerCase())
    : clubs;

  // Filtered clubs for faculty (case-insensitive)
  const facultyClubs = user && user.role === 'faculty'
    ? clubs.filter(club => club.faculty && user.name && club.faculty.toLowerCase() === user.name.toLowerCase())
    : clubs;

  if (!user) {
    return (
      <div className="login-page">
        <div className="login-box">
          <div className="login-logo">🎓</div>
          <h2>Login</h2>
          {logoutMessage && (
            <div style={{ color: 'green', marginBottom: '1rem', fontSize: '1rem' }}>{logoutMessage}</div>
          )}
          <input
            type="text"
            placeholder={loginRole === 'faculty' ? "Your Name (e.g., Prof. Sharma)" : "Your Name"}
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
          />
          <select value={loginRole} onChange={(e) => setLoginRole(e.target.value)}>
            <option value="admin">Admin (SWC)</option>
            <option value="president">Club President</option>
            <option value="faculty">Faculty Coordinator</option>
          </select>
          <div style={{
            fontWeight: 'normal',
            fontStyle: 'italic',
            color: '#555',
            background: 'none',
            border: 'none',
            borderRadius: 0,
            padding: 0,
            margin: '1.2rem 0 1rem 0',
            fontSize: '1rem',
            boxShadow: 'none',
            textAlign: 'center'
          }}>
            Note: The name you enter should be the same as the name registered for the portal.
          </div>
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <span className="header-logo">🎓</span>
        <h1>VIT SWC Club Portal</h1>
        <div>
          Welcome, <strong>{user.role === 'faculty' ? `Prof. ${user.name.replace(/^Prof\.\s*/i, '')}` : user.name}</strong> ({user.role})
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {selectedClub !== null ? (
        <div className="club-page">
          <h2>{clubs[selectedClub].name}</h2>
          <div className="club-details-row" style={{ flexDirection: 'row', gap: '4rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap' }}>
            <p style={{ margin: 0 }}><strong>Description:</strong> {clubs[selectedClub].description || 'Not assigned'}</p>
            <p style={{ margin: 0 }}><strong>Category:</strong> {clubs[selectedClub].category || 'Not assigned'}</p>
            <p style={{ margin: 0 }}><strong>President:</strong> {clubs[selectedClub].president || 'Not assigned'}</p>
            <p style={{ margin: 0 }}><strong>Faculty:</strong> {clubs[selectedClub].faculty || 'Not assigned'}</p>
</div>

          {user.role === 'admin' && (
  <div className="assign-section">
    <div className="assign-group">
      <input
        placeholder="Assign President"
                  value={newClubPresident}
                  onChange={(e) => setNewClubPresident(e.target.value)}
      />
      <button onClick={assignPresident}>Assign</button>
    </div>
    <div className="assign-group">
      <input
        placeholder="Assign Faculty"
                  value={newClubFaculty}
                  onChange={(e) => setNewClubFaculty(e.target.value)}
      />
      <button onClick={assignFaculty}>Assign</button>
    </div>
  </div>
)}

          {(user.role === 'admin' || user.role === 'president') && (
            <>
              <h3>Members</h3>
              <ul>
                {clubs[selectedClub].members.map((m, i) => (
                  <li key={i}>
                    <span style={{ cursor: 'pointer', color: '#0a2240', textDecoration: 'underline' }} onClick={() => alert(`Member: ${m}`)}>{m}</span>
                    {user.role === 'admin' && (
                      <button onClick={() => removeMember(m)}>❌</button>
                    )}
                  </li>
                ))}
              </ul>
           <div className="add-member-inline">
  <input
    type="text"
    placeholder="New Member"
    className="new-member-inline-input"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
  />
  <button onClick={addMember}>Add Member</button>
</div>
            </>
          )}

          {user.role === 'faculty' && (
            <>
              <h3>Members</h3>
              <ul>
                {clubs[selectedClub].members.map((m, i) => (
                  <li key={i}>👤 {m}</li>
                ))}
              </ul>
            </>
          )}

          <br />
          <button onClick={() => setSelectedClub(null)}>⬅️ Back</button>
        </div>
      ) : (
        <>
          {user.role === 'admin' && (
            <>
              <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>📊 Clubs: {totalClubs}</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>👥 Members: {totalMembers}</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Technical: {categoryCounts['Technical'] || 0}</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Cultural: {categoryCounts['Cultural'] || 0}</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Social: {categoryCounts['Social'] || 0}</div>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ fontSize: '1rem', padding: '0.4rem 1rem', borderRadius: '7px', border: '1.5px solid #b0b8c9' }}>
                  <option value="All">All Categories</option>
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Social">Social</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Search clubs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ margin: '1rem 0', padding: '0.5rem', width: '100%' }}
              />
              <ul className="club-list">
                {filteredClubs.map((club, index) => {
                  const realIndex = clubs.indexOf(club);
                  return (
                    <li key={index} className="club-item">
                      {editClubIndex === realIndex ? (
                        <div className="edit-club-form">
                          {user.role === 'admin' && (
                            <>
                              <input
                                type="text"
                                placeholder="Club Name"
                                value={editClubData.name}
                                onChange={e => handleEditClubChange('name', e.target.value)}
                              />
                              <input
                                type="text"
                                placeholder="Description"
                                value={editClubData.description}
                                onChange={e => handleEditClubChange('description', e.target.value)}
                              />
                              <input
                                type="text"
                                placeholder="Category"
                                value={editClubData.category}
                                onChange={e => handleEditClubChange('category', e.target.value)}
                              />
                              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '2rem', width: '100%' }}>
                                <select
                                  value={editClubData.president}
                                  onChange={e => handleEditClubChange('president', e.target.value)}
                                  style={{ flex: 1, minWidth: '260px' }}
                                >
                                  <option value="">Assign President</option>
                                  {students.map((s, i) => (
                                    <option key={i} value={s}>{s}</option>
                                  ))}
                                </select>
                                <select
                                  value={editClubData.faculty}
                                  onChange={e => handleEditClubChange('faculty', e.target.value)}
                                  style={{ flex: 1, minWidth: '260px' }}
                                >
                                  <option value="">Assign Faculty</option>
                                  {faculty.map((f, i) => (
                                    <option key={i} value={f}>{f}</option>
                                  ))}
                                </select>
                              </div>
                              <button onClick={handleSaveEditClub}>Save</button>
                              <button onClick={handleCancelEdit}>Cancel</button>
                            </>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="club-info">
                            <strong style={{ fontWeight: 'bold', fontSize: '1.4rem', display: 'block', marginBottom: '0.2rem' }}>{club.name}</strong>
                            <div style={{ fontSize: '0.95em', color: '#555', marginBottom: '0.2rem' }}>{club.description} | {club.category}</div>
                            <div className="club-buttons" style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                              {user.role === 'admin' && (
                                <>
                                  <button style={{ fontSize: '0.85em', padding: '2px 7px' }} onClick={() => handleClubSelect(realIndex)}>🔧 Manage</button>
                                  <button style={{ fontSize: '0.85em', padding: '2px 7px' }} onClick={() => toggleViewMembers(realIndex)}>
                                    {viewMembersIndex === realIndex ? '🙈 Hide Members' : '👁️ View Members'}
                                  </button>
                                  <button style={{ fontSize: '0.85em', padding: '2px 7px' }} onClick={() => handleEditClub(realIndex)}>✏️ Edit</button>
                                  <button style={{ fontSize: '0.85em', padding: '2px 7px' }} onClick={() => handleDeleteClub(realIndex)}>🗑️ Delete</button>
                                </>
                              )}
                              {user.role === 'president' && (
                                <>
                                  <button style={{ fontSize: '0.85em', padding: '2px 7px' }} onClick={() => handleClubSelect(realIndex)}>🔧 Manage</button>
                                  <button style={{ fontSize: '0.85em', padding: '2px 7px' }} onClick={() => toggleViewMembers(realIndex)}>
                                    {viewMembersIndex === realIndex ? '🙈 Hide Members' : '👁️ View Members'}
                                  </button>
                                </>
                              )}
                              {user.role === 'faculty' && (
                                <button style={{ fontSize: '0.85em', padding: '2px 7px' }} onClick={() => toggleViewMembers(realIndex)}>
                                  {viewMembersIndex === realIndex ? '🙈 Hide Members' : '👁️ View Members'}
                                </button>
                              )}
                            </div>
                          </div>
                          {viewMembersIndex === realIndex && (
                            <ul className="members-list">
                              {club.members.length > 0 ? (
                                club.members.map((m, i) => <li key={i}>👤 {m}</li>)
                              ) : (
                                <li>No members yet.</li>
                              )}
                            </ul>
                          )}
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
              {!showAddClubForm ? (
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <button onClick={() => setShowAddClubForm(true)} style={{ fontSize: '1rem', padding: '8px 18px' }}>Add Club Details</button>
                </div>
              ) : (
            <div className="add-club-form">
              <input
                type="text"
                placeholder="New Club Name"
                value={newClubName}
                onChange={(e) => setNewClubName(e.target.value)}
              />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newClubDescription}
                    onChange={(e) => setNewClubDescription(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newClubCategory}
                    onChange={(e) => setNewClubCategory(e.target.value)}
                  />
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '2rem', width: '100%' }}>
                    <select
                      value={newClubPresident}
                      onChange={(e) => setNewClubPresident(e.target.value)}
                      style={{ flex: 1, minWidth: '260px' }}
                    >
                      <option value="">Assign President</option>
                      {students.map((s, i) => (
                        <option key={i} value={s}>{s}</option>
                      ))}
                    </select>
                    <select
                      value={newClubFaculty}
                      onChange={(e) => setNewClubFaculty(e.target.value)}
                      style={{ flex: 1, minWidth: '260px' }}
                    >
                      <option value="">Assign Faculty</option>
                      {faculty.map((f, i) => (
                        <option key={i} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ marginTop: '0.7rem', display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleAddClub}>➕ Add Club</button>
                    <button onClick={() => setShowAddClubForm(false)} style={{ background: '#eee', color: '#333' }}>Cancel</button>
                  </div>
            </div>
              )}
            </>
          )}
          {user.role === 'president' && selectedClub === null && (
            presidentClubs.length === 0 ? (
              <div style={{ margin: '2rem 0', textAlign: 'center', color: '#b38f00', fontSize: '1.1rem' }}>
                You are not assigned as president to any club.
              </div>
            ) : (
          <ul className="club-list">
                {presidentClubs.map((club, index) => {
                  const realIndex = clubs.indexOf(club);
                  return (
              <li key={index} className="club-item">
                <div className="club-info">
                        <strong style={{ fontWeight: 'bold', fontSize: '1.4rem', display: 'block', marginBottom: '0.2rem' }}>{club.name}</strong>
                        <div style={{ fontSize: '0.95em', color: '#555', marginBottom: '0.2rem' }}>{club.description} | {club.category}</div>
                        <div className="club-buttons" style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                          <button style={{ fontSize: '0.85em', padding: '2px 7px' }} onClick={() => handleClubSelect(realIndex)}>🔧 Manage</button>
                          <button style={{ fontSize: '0.85em', padding: '2px 7px' }} onClick={() => toggleViewMembers(realIndex)}>
                            {viewMembersIndex === realIndex ? '🙈 Hide Members' : '👁️ View Members'}
                    </button>
                  </div>
                </div>
                      {viewMembersIndex === realIndex && (
                  <ul className="members-list">
                    {club.members.length > 0 ? (
                      club.members.map((m, i) => <li key={i}>👤 {m}</li>)
                    ) : (
                      <li>No members yet.</li>
                    )}
                  </ul>
                )}
              </li>
                  );
                })}
              </ul>
            )
          )}
          {user.role === 'faculty' && selectedClub === null && (
            facultyClubs.length === 0 ? (
              <div style={{ margin: '2rem 0', textAlign: 'center', color: '#b38f00', fontSize: '1.1rem' }}>
                You are not assigned as faculty coordinator to any club.
              </div>
            ) : (
              <ul className="club-list">
                {facultyClubs.map((club, index) => {
                  const realIndex = clubs.indexOf(club);
                  return (
                    <li key={index} className="club-item">
                      <div className="club-info">
                        <strong style={{ fontWeight: 'bold', fontSize: '1.4rem', display: 'block', marginBottom: '0.2rem' }}>{club.name}</strong>
                        <div style={{ fontSize: '0.95em', color: '#555', marginBottom: '0.2rem' }}>{club.description} | {club.category}</div>
                        <div className="club-buttons" style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                          <button style={{ fontSize: '0.85em', padding: '2px 7px' }} onClick={() => handleClubSelect(realIndex)}>
                            👁️ View Details
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
          </ul>
            )
          )}
        </>
      )}
    </div>
  );
}

export default App;
