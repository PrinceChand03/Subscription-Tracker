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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Subscriptions</h1>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Renewal Date</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map(sub => (
            <tr key={sub._id} className="border">
              <td className="border p-2">{sub.name}</td>
              <td className="border p-2">${sub.price.toFixed(2)}</td>
              <td className="border p-2">{new Date(sub.renewalDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
