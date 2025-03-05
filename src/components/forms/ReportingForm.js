import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addRowToTable, getTableData } from '../../api/googleSheetsApi';
import { MultiSelect } from 'react-multi-select-component';
import NotionMultiSelect from '../NotionMultiSelect';

const ReportingForm = ({ show, onHide, onSubmit, initialData = {} }) => {
  const defaultFormData = {
    CATEGORY: 'reporting',
    SOURCE_TYPE: '',
    HEADLINE: '',
    POST_CONTENT: '',
    PLATFORM: '',
    REGION: [],
    SPECTRUM: '',
    AUTHOR: '',
    URL: '',
    WHO: [],
    DATE_PUBLISHED: '',
    EVENT_TYPE_TAG: ''
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [entities, setEntities] = useState([]);
  const [eventTypeTags, setEventTypeTags] = useState([]);
  const [regions, setRegions] = useState([]);
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

    const fetchEventTypeTags = async () => {
      try {
        const data = await getTableData('eventtypetags');
        if (data && Array.isArray(data)) {
          setEventTypeTags(data.map(tag => ({
            value: tag.tag_id,
            label: tag.tag_name
          })));
        }
      } catch (err) {
        console.error('Error fetching event type tags:', err);
      }
    };

    const fetchRegions = async () => {
      try {
        const data = await getTableData('regions');
        if (data && Array.isArray(data)) {
          setRegions(data.map(region => ({
            value: region.region_id,
            label: region.region_name
          })));
        }
      } catch (err) {
        console.error('Error fetching regions:', err);
      }
    };

    fetchEntities();
    fetchEventTypeTags();
    fetchRegions();
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
      await addRowToTable('reporting', mappedData);
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
      headline: data.HEADLINE || '',
      description: data.POST_CONTENT || '',
      event_date: data.DATE_PUBLISHED || '',
      reporting_date: new Date().toISOString().split('T')[0],
      src_type: data.SOURCE_TYPE || 'article',
      platform: data.SOURCE_TYPE === 'social media post' ? data.PLATFORM : null,
      spectrum: data.SPECTRUM || '',
      category: 'reporting',
      entity_id: data.WHO && Array.isArray(data.WHO) && data.WHO.length > 0 ? data.WHO[0].value : null,
      event_type_tag: data.EVENT_TYPE_TAG || '',
      location: data.REGION && Array.isArray(data.REGION) && data.REGION.length > 0 ? data.REGION.map(region => region.value).join(', ') : '',
      source_link: data.URL || ''
    };
  };

  const renderReportingFields = () => (
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
        <Form.Label>Region</Form.Label>
        <NotionMultiSelect
          options={regions}
          value={formData.REGION}
          onChange={(value) => handleMultiSelectChange('REGION', value)}
          labelledBy="Select Region"
          allowNew={true}
          placeholder="Search or add new regions..."
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
        <Form.Label>Author</Form.Label>
        <Form.Control
          type="text"
          name="AUTHOR"
          value={formData.AUTHOR}
          onChange={handleChange}
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
        <Form.Label>Date Published</Form.Label>
        <Form.Control
          type="date"
          name="DATE_PUBLISHED"
          value={formData.DATE_PUBLISHED}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Event Type Tag</Form.Label>
        <Form.Select
          name="EVENT_TYPE_TAG"
          value={formData.EVENT_TYPE_TAG}
          onChange={handleChange}
        >
          <option value="">Select Event Type</option>
          {eventTypeTags.map(tag => (
            <option key={tag.value} value={tag.value}>
              {tag.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </>
  );

  const mandatoryFields = ['SOURCE_TYPE', 'HEADLINE', 'URL'];
  const isValid = mandatoryFields.every(field => formData[field]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Reporting Entry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {renderReportingFields()}
          {error && <div className="text-danger mt-2">{error}</div>}
          <Button
            variant="primary"
            type="submit"
            disabled={loading || !isValid}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ReportingForm;