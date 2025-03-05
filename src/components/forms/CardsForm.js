import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addRowToTable, getTableData } from '../../api/googleSheetsApi';
import NotionMultiSelect from '../NotionMultiSelect';

const CardsForm = ({ show, onHide, onSubmit }) => {
  const [formData, setFormData] = useState({
    WHO: [],
    WHO_TYPE: '',
    SPECTRUM: '',
    name: '',           // New field for entity name
    entity_type: '',    // New field for entity type
    description: ''      // New field for entity description
  });
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const data = await getTableData('entities');
        if (data && Array.isArray(data)) {
          setEntities(data.map(entity => ({
            value: entity.entity_id || entity.name,
            label: entity.name
          })));
        }
      } catch (err) {
        console.error('Error fetching entities:', err);
      }
    };

    fetchEntities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map data for CARDS table
      const mappedData = {
        WHO: formData.WHO.map(option => option.value),
        WHO_TYPE: formData.WHO_TYPE,
        SPECTRUM: formData.SPECTRUM
      };
      
      // Add entry to CARDS table
      await addRowToTable('CARDS', mappedData);

      // Map data for entities table
      const entityData = {
        name: formData.name,
        entity_type: formData.entity_type,
        description: formData.description
      };

      // Add entry to entities table
      await addRowToTable('entities', entityData);

      onSubmit();
      onHide();
      setFormData({
        WHO: [],
        WHO_TYPE: '',
        SPECTRUM: '',
        name: '',
        entity_type: '',
        description: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Card</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formWho">
            <Form.Label>Who</Form.Label>
            <NotionMultiSelect
              options={entities}
              value={formData.WHO}
              onChange={(value) => handleMultiSelectChange('WHO', value)}
              labelledBy="Select WHO"
              allowNew={true}
              placeholder="Search or add new entities..."
            />
          </Form.Group>
          <Form.Group controlId="formEntityName">
            <Form.Label>Entity Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEntityType">
            <Form.Label>Entity Type</Form.Label>
            <Form.Control
              type="text"
              name="entity_type"
              value={formData.entity_type}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEntityDescription">
            <Form.Label>Entity Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formWhoType">
            <Form.Label>Who Type</Form.Label>
            <Form.Select
              name="WHO_TYPE"
              value={formData.WHO_TYPE}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="Character">Character</option>
              <option value="Political Party">Political Party</option>
              <option value="Movement">Movement</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formSpectrum">
            <Form.Label>Spectrum</Form.Label>
            <Form.Select
              name="SPECTRUM"
              value={formData.SPECTRUM}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              <option value="LEFT">Left</option>
              <option value="CENTRE">Centre</option>
              <option value="RIGHT">Right</option>
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CardsForm;