import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface Subscription {
  _id: string;
  name: string;
  price: number;
  renewalDate: string;
}

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:5500/api/v1/subscriptions/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSubscriptions(response.data.data);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Your Subscriptions</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Renewal Date</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub._id}>
              <td>{sub.name}</td>
              <td>${sub.price.toFixed(2)}</td>
              <td>{new Date(sub.renewalDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
