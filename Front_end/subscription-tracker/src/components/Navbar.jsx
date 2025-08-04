// components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout, latestId }) => {
  const navigate = useNavigate();

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo} onClick={() => navigate('/dashboard')}>SubTrack</h2>

      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>All Subscriptions</Link>
        <Link to="/create-subscription" style={styles.link}>+ Add New</Link>
        {latestId && (
          <Link to={`/subscription/${latestId}/edit`} style={styles.link}>Edit Last</Link>
        )}
        <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};
 

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    padding: '1rem 2rem',
    color: 'white',
  },
  logo: {
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    backgroundColor: '#3b82f6',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    border: 'none',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Navbar;
