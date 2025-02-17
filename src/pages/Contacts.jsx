import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Alert, Spinner, Button } from 'react-bootstrap';
import PopupCreateContact from '../components/PopupCreateContact';
import PopupEditContact from '../components/PopupEditContact';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Состояния для попапов редактирования и подтверждения удаления
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  
  // Храним текущий контакт для редактирования/удаления
  const [selectedContact, setSelectedContact] = useState(null);

  const token = localStorage.getItem('token');

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://'+window.location.hostname+':8000/api/contacts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка загрузки контактов');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDeleteContact = async () => {
    try {
      await axios.delete('http://'+window.location.hostname+`:8000/api/contacts/${selectedContact.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDeletePopup(false);
      fetchContacts();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка удаления контакта');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Контакты</h2>
      <Button variant="primary" onClick={() => setShowCreatePopup(true)} className="mb-3">
        Создать контакт
      </Button>

      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Должность</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact.id}>
                <td>{contact.id}</td>
                <td>{contact.first_name}</td>
                <td>{contact.last_name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>{contact.position}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => {
                      setSelectedContact(contact);
                      setShowEditPopup(true);
                    }}
                    className="me-2"
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedContact(contact);
                      setShowDeletePopup(true);
                    }}
                  >
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Попап создания контакта */}
      <PopupCreateContact
        show={showCreatePopup}
        onClose={() => setShowCreatePopup(false)}
        onSuccess={fetchContacts}
      />

      {/* Попап редактирования контакта */}
      {selectedContact && (
        <PopupEditContact
          show={showEditPopup}
          onClose={() => setShowEditPopup(false)}
          onSuccess={fetchContacts}
          contact={selectedContact}
        />
      )}

      {/* Попап подтверждения удаления */}
      {selectedContact && (
        <DeleteConfirmationModal
          show={showDeletePopup}
          onClose={() => setShowDeletePopup(false)}
          onConfirm={handleDeleteContact}
          contact={selectedContact}
        />
      )}
    </Container>
  );
}

export default Contacts;
