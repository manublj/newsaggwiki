import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addRowToTable, getTableData } from '../../api/googleSheetsApi';
import { MultiSelect } from 'react-multi-select-component';
import NotionMultiSelect from '../NotionMultiSelect';

const EntryForm = ({ show, onHide, onSubmit, initialData = {}, children }) => {
  const defaultFormData = {
    CATEGORY: 'theory',
    SOURCE_TYPE: '',
    HEADLINE: '',
    POST_CONTENT: '',
    PLATFORM: '',
    AUTHOR: '',
    DOMAIN: '',
    URL: '',
    WHO: [],
    WHO_TYPE: '',
    SPECTRUM: '',
    KEYWORDS: '',
    DATE_PUBLISHED: '',
    EXCERPTS: ''
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const WHO_TYPE_OPTIONS = [
    { value: 'character', label: 'Character' },
    { value: 'party', label: 'Political Party' },
    { value: 'movement', label: 'Movement' }
  ];

  const SPECTRUM_OPTIONS = [
    { value: 'LEFT', label: 'Left' },
    { value: 'CENTRE', label: 'Centre' },
    { value: 'RIGHT', label: 'Right' }
  ];

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

  useEffect(() => {
    // Ensure form initializes correctly with initialData
    if (Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...defaultFormData,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const mappedData = mapFormDataToDbSchema(formData);
      await addRowToTable('theory', mappedData);
      onSubmit();
      onHide();
      setFormData(defaultFormData);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'An error occurred while submitting the form');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const mapFormDataToDbSchema = (data) => {
    return {
      title: data.HEADLINE || data.POST_CONTENT || '',
      description: data.POST_CONTENT || data.HEADLINE || '',
      author: data.AUTHOR || '',
      publication_date: data.DATE_PUBLISHED || '',
      src_type: data.SOURCE_TYPE || 'article',
      platform: data.SOURCE_TYPE === 'social media post' ? data.PLATFORM : null,
      domain: data.DOMAIN || '',
      keyword_tags: data.KEYWORDS || '',
      spectrum: data.SPECTRUM || '',
      category: 'theory',
      entity_id: data.WHO && Array.isArray(data.WHO) && data.WHO.length > 0 ? data.WHO[0].value : null,
      references: data.URL || ''
    };
  };

  const renderTheoryFields = () => (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Source Type*</Form.Label>
        <Form.Select
          name="SOURCE_TYPE"
          value={formData.SOURCE_TYPE}
          onChange={handleChange}
          required
        >
          <option value="">Select Source Type</option>
          <option value="social media post">Social Media Post</option>
          <option value="article">Article</option>
          <option value="book">Book</option>
          <option value="pdf">PDF</option>
        </Form.Select>
      </Form.Group>
  
      <Form.Group className="mb-3">
        <Form.Label>Headline*</Form.Label>
        <Form.Control
          type="text"
          name="HEADLINE"
          value={formData.HEADLINE}
          onChange={handleChange}
          required
        />
      </Form.Group>
  
      {formData.SOURCE_TYPE === 'social media post' && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Post Content*</Form.Label>
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
            <Form.Label>Platform*</Form.Label>
            <Form.Select
              name="PLATFORM"
              value={formData.PLATFORM}
              onChange={handleChange}
              required
            >
              <option value="">Select Platform</option>
              <option value="FB">Facebook</option>
              <option value="IG">Instagram</option>
              <option value="X">Twitter</option>
              <option value="YT">YouTube</option>
            </Form.Select>
          </Form.Group>
        </>
      )}
  
      <Form.Group className="mb-3">
        <Form.Label>Author</Form.Label>
        <Form.Control
          type="text"
          name="AUTHOR"
          value={formData.AUTHOR}
          onChange={handleChange}
        />
      </Form.Group>
  
      {formData.SOURCE_TYPE === 'article' && (
        <Form.Group className="mb-3">
          <Form.Label>Domain</Form.Label>
          <Form.Control
            type="text"
            name="DOMAIN"
            value={formData.DOMAIN}
            onChange={handleChange}
          />
        </Form.Group>
      )}
  
      <Form.Group className="mb-3">
        <Form.Label>URL*</Form.Label>
        <Form.Control
          type="url"
          name="URL"
          value={formData.URL}
          onChange={handleChange}
          required
        />
      </Form.Group>
  
      <Form.Group className="mb-3">
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
  
      <Form.Group className="mb-3">
        <Form.Label>WHO_TYPE</Form.Label>
        <Form.Select
          name="WHO_TYPE"
          value={formData.WHO_TYPE}
          onChange={handleChange}
        >
          <option value="">Select WHO Type</option>
          {WHO_TYPE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Form.Select>
      </Form.Group>
  
      <Form.Group className="mb-3">
        <Form.Label>SPECTRUM</Form.Label>
        <Form.Select
          name="SPECTRUM"
          value={formData.SPECTRUM}
          onChange={handleChange}
        >
          <option value="">Select Spectrum</option>
          {SPECTRUM_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Form.Select>
      </Form.Group>
  
      <Form.Group className="mb-3">
        <Form.Label>Keywords</Form.Label>
        <Form.Control
          type="text"
          name="KEYWORDS"
          value={formData.KEYWORDS}
          onChange={handleChange}
          placeholder="Type keywords separated by commas"
        />
      </Form.Group>
  
      <Form.Group className="mb-3">
        <Form.Label>Date Published</Form.Label>
        <Form.Control
          type="date"
          name="DATE_PUBLISHED"
          value={formData.DATE_PUBLISHED}
          onChange={handleChange}
        />
      </Form.Group>
  
      <Form.Group className="mb-3">
        <Form.Label>Excerpts</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="EXCERPTS"
          value={formData.EXCERPTS}
          onChange={handleChange}
        />
      </Form.Group>
    </>
  );
  
  const mandatoryFields = ['SOURCE_TYPE', 'HEADLINE', 'URL'];
  const isValid = mandatoryFields.every(field => formData[field]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Theory Entry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {renderTheoryFields()}
          
          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading || !isValid}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
          
          {error && (
            <div className="alert alert-danger mt-3">
              {error}
            </div>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EntryForm;