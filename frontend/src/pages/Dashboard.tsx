import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface Subscription {
  _id: string;
  name: string;
  price: number;
  renewalDate: Date;
  currency: string;
  frequency: string;
  category: string;
  paymentMethod: string;
  startDate: Date;
  status: string;
}

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSub, setNewSub] = useState({
    name: "",
    price: "",
    currency: "USD",
    frequency: "monthly",
    category: "",
    startDate: "",
    paymentMethod: "",
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewSub({ ...newSub, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) return;

      const response = await axios.post(
        `http://localhost:5500/api/v1/subscriptions`,
        { ...newSub, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setSubscriptions([...subscriptions, response.data.data]);
        setShowModal(false);
        setNewSub({
          name: "",
          price: "",
          currency: "USD",
          frequency: "monthly",
          category: "",
          startDate: "",
          paymentMethod: "",
        });
      }
    } catch (error) {
      console.error("Error adding subscription:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Your Subscriptions</h1>
      <Button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
        Add Subscription
      </Button>


      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Name"
                value={newSub.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="Price"
                value={newSub.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCurrency">
              <Form.Label>Currency</Form.Label>
              <Form.Control
                as="select"
                name="currency"
                value={newSub.currency}
                onChange={handleInputChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formFrequency">
              <Form.Label>Frequency</Form.Label>
              <Form.Control
                as="select"
                name="frequency"
                value={newSub.frequency}
                onChange={handleInputChange}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                placeholder="Category"
                value={newSub.category}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={newSub.startDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPaymentMethod">
              <Form.Label>Payment Method</Form.Label>
              <Form.Control
                type="text"
                name="paymentMethod"
                placeholder="Payment Method"
                value={newSub.paymentMethod}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit" className="mt-3">
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Currency</th>
            <th>Frequency</th>
            <th>Category</th>
            <th>Payment Method</th>
            <th>Renewal Date</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub._id}>
              <td>{sub.name}</td>
              <td>${sub.price.toFixed(2)}</td>
              <td>{sub.currency}</td>
              <td>{sub.frequency}</td>
              <td>{sub.category}</td>
              <td>{sub.paymentMethod}</td>
              <td>{new Date(sub.renewalDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
