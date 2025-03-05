import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addRowToTable, getTableData } from '../../api/googleSheetsApi';
import NotionMultiSelect from '../NotionMultiSelect';

const EntitiesForm = ({ show, onHide, onSubmit }) => {
  const [formData, setFormData] = useState({
    entity_id: '',
    WHO: '',
    SPECTRUM: '',
    bio: '',
    entity_type: ''
  });
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const data = await getTableData('ENTITIES');
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
      // Map data for ENTITIES table
      const entityData = {
        entity_id: formData.entity_id,
        WHO: formData.WHO,
        bio: formData.bio,
        entity_type: formData.entity_type,
        SPECTRUM: formData.SPECTRUM
      };

      // Add entry to ENTITIES table
      await addRowToTable('ENTITIES', entityData);

      onSubmit();
      onHide();
      setFormData({
        entity_id: '',
        WHO: '',
        SPECTRUM: '',
        bio: '',
        entity_type: ''
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
          <Form.Group className="mb-3">
            <Form.Label>WHO (Entity Name)</Form.Label>
            <NotionMultiSelect
              options={entities}
              value={formData.WHO}
              onChange={(value) => handleMultiSelectChange('WHO', value)}
              labelledBy="Select WHO"
              allowNew={true}
              placeholder="Search or add new entities..."
            />
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
          <Form.Group controlId="formEntityBio">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              type="text"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formEntityType">
            <Form.Label>Entity Type</Form.Label>
            <Form.Select
              name="entity_type"
              value={formData.entity_type}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="Character">Character</option>
              <option value="Party">Party</option>
              <option value="Movement">Movement</option>
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

export default EntitiesForm;