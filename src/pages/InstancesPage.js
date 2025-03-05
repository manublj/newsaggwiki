import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Dropdown } from 'react-bootstrap';
import { getTableData } from '../api/googleSheetsApi';
import InstancesForm from '../components/forms/InstancesForm';
import FloatingButton from '../components/FloatingButton';

const InstancesPage = () => {
  const [selectedType, setSelectedType] = useState('discrimination');
  const [instances, setInstances] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const instanceTypes = [
    { value: 'discrimination', label: 'Discrimination' },
    { value: 'sexual_abuse', label: 'Sexual Abuse' },
    { value: 'exploitation', label: 'Exploitation' },
    { value: 'state_violence', label: 'State Violence' },
    { value: 'state_sponsored_terrorism', label: 'State Sponsored Terrorism' },
    { value: 'religious_stupidity', label: 'Religious Stupidity' }
  ];

  useEffect(() => {
    loadInstances();
  }, [selectedType]);

  const loadInstances = async () => {
    try {
      const data = await getTableData('instances');
      // Filter instances based on selected type
      const filteredData = data.filter(instance => 
        instance.INSTANCE_TYPE === selectedType
      );
      setInstances(filteredData);
    } catch (error) {
      console.error('Error loading instances:', error);
    }
  };

  const handleFormSubmit = () => {
    loadInstances();
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            color: 'black', 
            textAlign: 'center' 
          }}>
            REPORTED INSTANCES OF{' '}
            <Form.Select 
              value={selectedType}
              onChange={handleTypeChange}
              style={{ 
                display: 'inline-block', 
                width: 'auto', 
                fontWeight: 'bold',
                fontSize: '2.5rem'
              }}
            >
              {instanceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label.toUpperCase()}
                </option>
              ))}
            </Form.Select>
          </h1>
        </Col>
      </Row>

      <Row>
        {instances.length > 0 ? (
          instances.map((instance, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{instance.HEADLINE}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {new Date(instance.DATE_REPORTED).toLocaleDateString()}
                  </Card.Subtitle>
                  <Card.Text>{instance.POST_CONTENT}</Card.Text>
                  <Card.Text>
                    <strong>Location:</strong> {instance.LOCATION}
                  </Card.Text>
                  {instance.URL && (
                    <Button 
                      variant="link" 
                      href={instance.URL} 
                      target="_blank"
                    >
                      Source
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center">
            <p>No instances found. Add a new instance using the + button.</p>
          </Col>
        )}
      </Row>

      <FloatingButton onClick={() => setShowForm(true)} />

      <InstancesForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
      />
    </Container>
  );
};

export default InstancesPage;