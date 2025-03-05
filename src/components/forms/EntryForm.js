import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addRowToTable, getTableData } from '../../api/googleSheetsApi';
import { MultiSelect } from 'react-multi-select-component';
import NotionMultiSelect from '../NotionMultiSelect';

const EntryForm = ({ show, onHide, onSubmit, initialData = {}, children }) => {
  const defaultFormData = {
    CATEGORY: 'theory',
    SOURCE_TYPE: '',
    TITLE: '',
    POST_CONTENT: '',
    PLATFORM: '',
    AUTHOR: [],
    ABSTRACT: '',
    DOMAIN: [],
    URL: '',
    WHO: [],
    SPECTRUM: '',
    KEYWORDS: [],
    DATE_PUBLISHED: ''
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [entities, setEntities] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [domains, setDomains] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const SPECTRUM_OPTIONS = [
    { value: 'LEFT', label: 'Left' },
    { value: 'CENTRE', label: 'Centre' },
    { value: 'RIGHT', label: 'Right' }
  ];

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const data = await getTableData('ENTITIES');
        if (data && Array.isArray(data)) {
          setEntities(data.map(entity => ({
            value: entity.WHO || entity.name,
            label: entity.name
          })));
        }
      } catch (err) {
        console.error('Error fetching ENTITIES:', err);
      }
    };

    const fetchKeywords = async () => {
      try {
        const data = await getTableData('keywords');
        if (data && Array.isArray(data)) {
          setKeywords(data.map(keyword => ({
            value: keyword.keyword_id || keyword.keyword,
            label: keyword.keyword
          })));
        }
      } catch (err) {
        console.error('Error fetching keywords:', err);
      }
    };

    const fetchDomains = async () => {
      try {
        const data = await getTableData('domains');
        if (data && Array.isArray(data)) {
          setDomains(data.map(domain => ({
            value: domain.domain_id || domain.domain,
            label: domain.domain
          })));
        }
      } catch (err) {
        console.error('Error fetching domains:', err);
      }
    };

    const fetchAuthors = async () => {
      try {
        const data = await getTableData('authors');
        if (data && Array.isArray(data)) {
          setAuthors(data.map(author => ({
            value: author.author_id || author.author,
            label: author.author
          })));
        }
      } catch (err) {
        console.error('Error fetching authors:', err);
      }
    };

    fetchEntities();
    fetchKeywords();
    fetchDomains();
    fetchAuthors();
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
      title: data.TITLE || '',
      description: data.POST_CONTENT || '',
      author: data.AUTHOR && Array.isArray(data.AUTHOR) ? data.AUTHOR.map(a => a.value || a.label).join(',') : '',
      abstract: data.ABSTRACT || '',
      publication_date: data.DATE_PUBLISHED || '',
      src_type: data.SOURCE_TYPE || 'article',
      platform: data.SOURCE_TYPE === 'social media post' ? data.PLATFORM : null,
      domain: data.DOMAIN && Array.isArray(data.DOMAIN) ? data.DOMAIN.map(d => d.value || d.label).join(',') : '',
      keywords: data.KEYWORDS.map(k => k.value || k.label).join(','),
      spectrum: data.SPECTRUM || '',
      category: 'theory',
      WHO: data.WHO && Array.isArray(data.WHO) && data.WHO.length > 0 ? data.WHO[0].value : null,
      url: data.URL || ''
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
        <Form.Label>Title*</Form.Label>
        <Form.Control
          type="text"
          name="TITLE"
          value={formData.TITLE}
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
            <Form.Label>Keywords</Form.Label>
            <NotionMultiSelect
              options={keywords}
              value={formData.KEYWORDS}
              onChange={(value) => handleMultiSelectChange('KEYWORDS', value)}
              labelledBy="Select Keywords"
              allowNew={true}
              placeholder="Search or add new keywords..."
            />
          </Form.Group>
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
          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <NotionMultiSelect
              options={authors}
              value={formData.AUTHOR}
              onChange={(value) => handleMultiSelectChange('AUTHOR', value)}
              labelledBy="Select Author"
              allowNew={true}
              placeholder="Search or add new authors..."
            />
          </Form.Group>
        </>
      )}
  
      {(formData.SOURCE_TYPE === 'article' || formData.SOURCE_TYPE === 'book' || formData.SOURCE_TYPE === 'pdf') && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Abstract</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="ABSTRACT"
              value={formData.ABSTRACT}
              onChange={handleChange}
            />
          </Form.Group>
          
          {formData.SOURCE_TYPE === 'article' && (
            <Form.Group className="mb-3">
              <Form.Label>Domain</Form.Label>
              <NotionMultiSelect
                options={domains}
                value={formData.DOMAIN}
                onChange={(value) => handleMultiSelectChange('DOMAIN', value)}
                labelledBy="Select Domain"
                allowNew={true}
                placeholder="Search or add new domains..."
              />
            </Form.Group>
          )}
          
          <Form.Group className="mb-3">
            <Form.Label>Keywords</Form.Label>
            <NotionMultiSelect
              options={keywords}
              value={formData.KEYWORDS}
              onChange={(value) => handleMultiSelectChange('KEYWORDS', value)}
              labelledBy="Select Keywords"
              allowNew={true}
              placeholder="Search or add new keywords..."
            />
          </Form.Group>
          
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
        </>
      )}
  
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
        <Form.Label>Spectrum</Form.Label>
        <Form.Select
          name="SPECTRUM"
          value={formData.SPECTRUM}
          onChange={handleChange}
        >
          <option value="">Select an option</option>
          {SPECTRUM_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
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
    </>
  );

  const mandatoryFields = ['SOURCE_TYPE', 'TITLE', 'URL', 'ABSTRACT'];
  const isValid = mandatoryFields.every(field => formData[field]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Theory Entry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {renderTheoryFields()}
          {children}
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