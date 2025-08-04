import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubscriptionById, updateSubscription } from '../API/API';

const EditSubscription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    paymentMethod: '',
    startDate: '',
    renewalDate: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSubscriptionById(id);
        const sub = res.data.data;
        const formattedData = {
          name: sub.name,
          price: sub.price,
          category: sub.category,
          paymentMethod: sub.paymentMethod,
          startDate: sub.startDate.split('T')[0],
          renewalDate: sub.renewalDate.split('T')[0]
        };
        setFormData(formattedData);
        setOriginalData(formattedData);
      } catch (err) {
        console.error('Failed to fetch subscription:', err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSubscription(id, formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleCancel = () => {
    setFormData(originalData); // optional: reset form
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div style={styles.container}>
      <h2>Edit Subscription</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Service Name"
          required
          style={styles.input}
        />
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
          style={styles.input}
        />
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          required
          style={styles.input}
        />
        <input
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          placeholder="Payment Method"
          required
          style={styles.input}
        />
        <label style={styles.label}>Start Date:</label>
        <input
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <label style={styles.label}>Renewal Date:</label>
        <input
          name="renewalDate"
          type="date"
          value={formData.renewalDate}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.saveBtn}>Update</button>
          <button type="button" onClick={handleCancel} style={styles.cancelBtn}>Cancel</button>
          <button type="button" onClick={handleBack} style={styles.backBtn}>← Back</button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '500px',
    margin: 'auto',
    backgroundColor: '#f3f4f6',
    borderRadius: '10px',
    marginTop: '3rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  label: {
    fontWeight: 'bold',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  saveBtn: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelBtn: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#facc15',
    color: '#000',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  backBtn: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#9ca3af',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default EditSubscription;
