import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addRowToTable } from '../../api/googleSheetsApi';
import NotionMultiSelect from '../NotionMultiSelect'; // Assuming NotionMultiSelect is in the same directory

const InstancesForm = ({ show, onHide, onSubmit }) => {
  const [formData, setFormData] = useState({
    INSTANCE_TYPE: '',
    HEADLINE: '',
    POST_CONTENT: '',
    LOCATION: '',
    DATE_REPORTED: '',
    URL: '',
    SPECTRUM: ''
  });

  const instanceTypes = [
    { value: 'discrimination', label: 'Discrimination' },
    { value: 'sexual_abuse', label: 'Sexual Abuse' },
    { value: 'exploitation', label: 'Exploitation' },
    { value: 'state_violence', label: 'State Violence' },
    { value: 'state_sponsored_terrorism', label: 'State Sponsored Terrorism' },
    { value: 'religious_stupidity', label: 'Religious Stupidity' }
  ];

  const locations = [
    // Assuming locations is an array of options
    // You need to populate this array with your actual location options
  ];

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
      await addRowToTable('instances', formData);
      onSubmit();
      onHide();
      setFormData({
        INSTANCE_TYPE: '',
        HEADLINE: '',
        POST_CONTENT: '',
        LOCATION: '',
        DATE_REPORTED: '',
        URL: '',
        SPECTRUM: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Instance Entry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formInstanceType">
            <Form.Label>Instance Type</Form.Label>
            <Form.Select 
              name="INSTANCE_TYPE" 
              value={formData.INSTANCE_TYPE} 
              onChange={handleChange} 
              required
            >
              <option value="">Select Instance Type</option>
              {instanceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formHeadline">
            <Form.Label>Headline</Form.Label>
            <Form.Control 
              type="text" 
              name="HEADLINE" 
              value={formData.HEADLINE} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>
          <Form.Group controlId="formPostContent">
            <Form.Label>Post Content</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              name="POST_CONTENT" 
              value={formData.POST_CONTENT} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <NotionMultiSelect
              options={locations}
              value={formData.LOCATION}
              onChange={(value) => handleMultiSelectChange('LOCATION', value)}
              labelledBy="Select Location"
              allowNew={true}
              placeholder="Search or add new locations..."
            />
          </Form.Group>
          <Form.Group controlId="formDateReported">
            <Form.Label>Date Reported</Form.Label>
            <Form.Control 
              type="date" 
              name="DATE_REPORTED" 
              value={formData.DATE_REPORTED} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>
          <Form.Group controlId="formURL">
            <Form.Label>URL</Form.Label>
            <Form.Control 
              type="url" 
              name="URL" 
              value={formData.URL} 
              onChange={handleChange} 
            />
          </Form.Group>
          <Form.Group controlId="formSpectrum">
            <Form.Label>Spectrum</Form.Label>
            <Form.Select 
              name="SPECTRUM" 
              value={formData.SPECTRUM} 
              onChange={handleChange}
            >
              <option value="">Select Spectrum</option>
              <option value="LEFT">Left</option>
              <option value="CENTRE">Centre</option>
              <option value="RIGHT">Right</option>
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">Submit</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default InstancesForm;