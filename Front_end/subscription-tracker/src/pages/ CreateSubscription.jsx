import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSubscription } from '../API/API';
import Navbar from '../components/Navbar';

const CreateSubscription = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    paymentMethod: '',
    startDate: '',
    renewalDate: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSubscription(formData);
      setMessage('✅ Subscription created successfully!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <>
      <Navbar onLogout={() => {
        localStorage.clear();
        navigate('/login');
      }} />
      <div style={styles.container}>
        <h2>Create New Subscription</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required style={styles.input} />
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required style={styles.input} />
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required style={styles.input} />
          <input type="date" name="renewalDate" value={formData.renewalDate} onChange={handleChange} required style={styles.input} />

        <select name="category" value={formData.category} onChange={handleChange} required style={styles.input}>
  <option value="">Select Category</option>
  <option value="entertainment">Entertainment</option>
  <option value="technology">Technology</option>
  <option value="finance">Finance</option>
  <option value="music">Music</option>
  <option value="movies">Movies</option>
  <option value="news">News</option>
  <option value="sports">Sports</option>
  <option value="lifestyle">Lifestyle</option>
  <option value="education">Education</option>
  <option value="kids">Kids</option>
  <option value="other">Other</option>
</select>


          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required style={styles.input}>
            <option value="">Select Payment Method</option>
            <option value="paypal">Paypal</option>
            <option value="mastercard">Mastercard</option>
            <option value="esewa">E-Sewa</option>
            <option value="khalti">Khalti</option>
            <option value="ime pay">IME Pay</option>
          </select>

          <button type="submit" style={styles.button}>Create</button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: 'auto',
    padding: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.75rem',
    borderRadius: '5px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  message: {
    marginTop: '1rem',
    color: 'green',
  },
};

export default CreateSubscription;
