import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addRowToTable, getTableData } from '../../api/googleSheetsApi';
import NotionMultiSelect from '../NotionMultiSelect';

const InstancesForm = ({ show, onHide, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instance_type: 'discrimination',
    date_reported: '',
    location: '',
    source_link: '',
    WHO: []
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
  }, [getTableData]); // Add getTableData as a dependency

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
      const mappedData = {
        title: formData.title,
        description: formData.description,
        instance_type: formData.instance_type,
        date_reported: formData.date_reported,
        location: formData.location,
        source_link: formData.source_link,
        entity_id: formData.WHO && Array.isArray(formData.WHO) && formData.WHO.length > 0 ? formData.WHO[0].value : null
      };
      await addRowToTable('instances', mappedData);
      onSubmit();
      onHide();
      setFormData({
        title: '',
        description: '',
        instance_type: 'discrimination',
        date_reported: '',
        location: '',
        source_link: '',
        WHO: []
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Report Instance</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formInstanceType">
            <Form.Label>Instance Type</Form.Label>
            <Form.Control
              as="select"
              name="instance_type"
              value={formData.instance_type}
              onChange={handleChange}
            >
              <option value="discrimination">Discrimination</option>
              <option value="harassment">Harassment</option>
              <option value="other">Other</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formWHO" className="mb-3">
            <Form.Label>WHO</Form.Label>
            <NotionMultiSelect
              options={entities}
              value={formData.WHO}
              onChange={(value) => handleMultiSelectChange('WHO', value)}
              labelledBy="Select WHO"
              allowNew={true}
              placeholder="Search or add new entities..."
            />
          </Form.Group>
          <Form.Group controlId="formDateReported">
            <Form.Label>Date Reported</Form.Label>
            <Form.Control
              type="date"
              name="date_reported"
              value={formData.date_reported}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formSourceLink">
            <Form.Label>Source Link</Form.Label>
            <Form.Control
              type="url"
              name="source_link"
              value={formData.source_link}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default InstancesForm;