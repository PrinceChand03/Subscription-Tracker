import React, { useState } from 'react';
import { signIn, signUp } from '../API/API';
import { useNavigate } from 'react-router-dom';

const SignIn = ({ setUser }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsSignup(prev => !prev);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = isSignup
        ? await signUp(formData)
        : await signIn(formData);

      const { user, token } = res.data.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isSignup ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignup && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            {isSignup ? 'Sign Up' : 'Login'}
          </button>

          {error && <p style={styles.error}>{error}</p>}
        </form>

        <p style={styles.toggle}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span onClick={toggleMode} style={styles.toggleLink}>
            {isSignup ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f0f4f8',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '1rem',
  },
  label: {
    marginBottom: '0.25rem',
    fontSize: '0.9rem',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem',
    transition: 'background-color 0.3s',
  },
  error: {
    marginTop: '1rem',
    color: 'red',
    textAlign: 'center',
  },
  toggle: {
    marginTop: '1rem',
    textAlign: 'center',
    color: '#555',
  },
  toggleLink: {
    color: '#4f46e5',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginLeft: '0.25rem',
  },
};

export default SignIn;
