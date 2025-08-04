import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getUserSubscriptions, signOut, deleteSubscription } from '../API/API';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchSubscriptions = async () => {
      try {
        const res = await getUserSubscriptions(user.id);
        setSubscriptions(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load subscriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (_) {}
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this subscription?');
    if (!confirmDelete) return;

    try {
      await deleteSubscription(id);
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
    } catch (err) {
      alert('Failed to delete subscription.');
    }
  };

  if (!user) return <p>Please login to access your dashboard.</p>;

  return (
    <>
      <Navbar onLogout={handleLogout} latestId={subscriptions[subscriptions.length - 1]?.id} />

      <div style={styles.container}>
        <h1 style={{fontSize: '1.2rem' }}>Welcome, <strong>{user.name}</strong></h1>

        {loading && <p>Loading subscriptions...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {!loading && subscriptions.length === 0 && <p>You have no subscriptions yet.</p>}

        <div style={styles.grid}>
          {subscriptions.map((sub) => (
            <div key={sub.id} style={styles.card}>
              <h3>{sub.name}</h3>
              <p>Price: Rs. {sub.price}</p>
              <p>Status: <strong>{sub.status || 'active'}</strong></p>
              <p>Renews on: {new Date(sub.renewalDate).toLocaleDateString()}</p>

              <div style={styles.actions}>
                <button
                  onClick={() => navigate(`/subscription/${sub.id}/edit`)}
                  style={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sub.id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  error: {
    color: 'red',
  },
  grid: {
    marginTop: '2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  actions: {
    marginTop: '1rem',
    display: 'flex',
    gap: '0.5rem',
  },
  editBtn: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    color: '#fff',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default Dashboard;
