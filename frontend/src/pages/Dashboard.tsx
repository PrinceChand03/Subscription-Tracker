import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import LoadingSpinner from '../../components/LoadingSpinner';

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


  // Stato per il modale di aggiunta
  const [showAddModal, setShowAddModal] = useState(false);

  // Stato per il modale di modifica
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);


  const [newSub, setNewSub] = useState({
    name: "",
    price: "",
    currency: "EUR",
    frequency: "monthly",
    category: "sport",
    startDate: "",
    paymentMethod: "paypal",
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


  if (loading) return <LoadingSpinner />;


  // gestione input form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewSub({ ...newSub, [e.target.name]: e.target.value });
  };


  // Apre il modale di modifica con i dati dell'abbonamento selezionato
  const handleEditClick = (subscription: Subscription) => {
    setEditingSub(subscription);
    setShowEditModal(true);
  };

  // Chiude il modale di modifica
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingSub(null);
  };


  // Gestisce l'input per la modifica
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (editingSub) {
      setEditingSub({ ...editingSub, [e.target.name]: e.target.value });
    }
  };

  // Salva le modifiche
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token || !editingSub) return;

      const response = await axios.put(
        `http://localhost:5500/api/v1/subscriptions/${editingSub._id}`,
        editingSub,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setSubscriptions(subscriptions.map(sub => (sub._id === editingSub._id ? response.data.data : sub)));
        handleCloseEditModal();
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  // aggiunta nuova sottoscrizione
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
        setShowAddModal(false);
        setNewSub({
          name: "",
          price: "",
          currency: "EUR",
          frequency: "monthly",
          category: "sport",
          startDate: "",
          paymentMethod: "paypal",
        });

        // Ricarica la pagina
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding subscription:", error);
    }
  };


  // Eliminazione sottoscrizione
  const handleDelete = async (id: string) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa sottoscrizione?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5500/api/v1/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSubscriptions(subscriptions.filter(sub => sub._id !== id));
    } catch (error) {
      console.error("Errore nell'eliminazione della sottoscrizione:", error);
    }
  };


  return (
    <div className="container mt-5">
      <h1 className="mb-4">Le tue sottoscrizioni</h1>
      <Button className="btn btn-primary mb-3" onClick={() => setShowAddModal(true)}>
        Aggiungi sottoscrizione
      </Button>

      {/* Modal per Aggiunta */}
      <Modal show={showAddModal} onHide={() => { setShowAddModal(false) }}>
        <Modal.Header closeButton>
          <Modal.Title>Nuova sottoscrizione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>

            <Form.Group controlId="formName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Nome"
                value={newSub.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPrice">
              <Form.Label>Prezzo</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="Prezzo"
                value={newSub.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formCurrency">
              <Form.Label>Valuta</Form.Label>
              <Form.Control
                as="select"
                name="currency"
                value={newSub.currency}
                onChange={handleInputChange}
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formFrequency">
              <Form.Label>Frequenza</Form.Label>
              <Form.Control
                as="select"
                name="frequency"
                value={newSub.frequency}
                onChange={handleInputChange}
              >
                <option value="daily">Giornaliera</option>
                <option value="weekly">Settimanale</option>
                <option value="monthly">Mensile</option>
                <option value="yearly">Annua</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formCategory">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={newSub.category}
                onChange={handleInputChange}
                required
              >
                <option value="sport">Sport</option>
                <option value="intrattenimento">Intrattenimento</option>
                <option value="musica">Musica</option>
                <option value="tecnologia">Tecnologia</option>
                <option value="notizie">Notizie</option>
                <option value="altro">Altro</option>
                <option value="finanza">Finanza</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="bambini">Bambini</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formStartDate">
              <Form.Label>Data inizio</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={newSub.startDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPaymentMethod">
              <Form.Label>Metodo di pagamento</Form.Label>
              <Form.Control
                as="select"
                name="paymentMethod"
                value={newSub.paymentMethod}
                onChange={handleInputChange}
                required
              >
                <option value="paypal">PayPal</option>
                <option value="mastercard">Mastercard</option>
                <option value="bonifico">Bonifico</option>
                <option value="contanti">Contanti</option>
                <option value="altro">Altro</option>
              </Form.Control>
            </Form.Group>

            <Button variant="success" type="submit" className="mt-3">
              Aggiungi
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Prezzo</th>
            <th>Valuta</th>
            <th>Frequenza</th>
            <th>Categoria</th>
            <th>Metodo pagamento</th>
            <th>Rinnovo</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub._id}>
              <td>{sub.name}</td>
              <td>{sub.price}</td>
              <td>{sub.currency}</td>
              <td>{sub.frequency}</td>
              <td>{sub.category}</td>
              <td>{sub.paymentMethod}</td>
              <td>
                {sub.renewalDate && !isNaN(new Date(sub.renewalDate).getTime())
                  ? new Date(sub.renewalDate).toLocaleDateString()
                  : "N/A"}
              </td>

              <td>
                <Button variant="warning" className="btn-sm me-2" onClick={() => handleEditClick(sub)}>✏️</Button>
                <Button variant="danger" className="btn-sm" onClick={() => handleDelete(sub._id)}>🗑️</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal per Modifica */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingSub && (
            <Form onSubmit={handleEditSubmit}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={editingSub.name} onChange={handleEditInputChange} required />
              </Form.Group>

              <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" name="price" value={editingSub.price} onChange={handleEditInputChange} required />
              </Form.Group>

              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Control type="text" name="category" value={editingSub.category} onChange={handleEditInputChange} required />
              </Form.Group>

              <Form.Group>
                <Form.Label>Payment Method</Form.Label>
                <Form.Control type="text" name="paymentMethod" value={editingSub.paymentMethod} onChange={handleEditInputChange} required />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">Save Changes</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;
