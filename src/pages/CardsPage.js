import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tabs, Tab, Button, Spinner, Table, Form } from 'react-bootstrap';
import CardView from '../components/CardView';
import CardsForm from '../components/forms/CardsForm';
import SearchBar from '../components/SearchBar';
import { getSheetData, addRowToSheet } from '../api/googleSheetsApi';
import { MultiSelect } from 'react-multi-select-component';

const CardsPage = () => {
  const [cards, setCards] = useState([]);
  const [articles, setArticles] = useState({ theory: [], reporting: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Character');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ WHO: [], WHO_TYPE: '', SPECTRUM: '' });
  const [whoOptions, setWhoOptions] = useState([]);
  const [whoTypeOptions, setWhoTypeOptions] = useState([]);
  const [spectrumOptions, setSpectrumOptions] = useState([]);
  const [whoInput, setWhoInput] = useState('');
  const [selectedWho, setSelectedWho] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cardsData, theoryData, reportingData, whoData] = await Promise.all([
        getSheetData('CARDS'),
        getSheetData('theory'),
        getSheetData('reporting'),
        getSheetData('WHO')
      ]);
      
      setCards(cardsData);
      setArticles({
        theory: theoryData,
        reporting: reportingData,
        who: whoData
      });
      setWhoOptions(whoData.map(item => ({ value: item.WHO, label: item.WHO })));
      setWhoTypeOptions([{ value: 'character', label: 'Character' }, { value: 'party', label: 'Party' }, { value: 'movement', label: 'Movement' }]);
      setSpectrumOptions([{ value: 'LEFT', label: 'LEFT' }, { value: 'CENTRE', label: 'CENTRE' }, { value: 'RIGHT', label: 'RIGHT' }]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredCards = cards.filter(card => {
    if (!searchQuery) return card.WHO_TYPE === activeTab;
    
    return card.WHO_TYPE === activeTab && 
           card.WHO && card.WHO.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getRelatedArticles = (who) => {
    const related = {
      theory: articles.theory.filter(article => 
        article.WHO && article.WHO.toLowerCase() === who.toLowerCase()
      ),
      reporting: articles.reporting.filter(article => 
        article.WHO && article.WHO.toLowerCase() === who.toLowerCase()
      )
    };
    
    return related;
  };

  const handleFormSubmit = async () => {
    try {
      await addRowToSheet('CARDS', formData);
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error submitting to CARDS sheet:', error);
    }
  };

  const handleChange = (event) => {
    if (event.target.name === 'WHO') {
      setFormData({ ...formData, WHO: event.map(item => item.value) });
    } else {
      setFormData({ ...formData, [event.target.name]: event.target.value });
    }
  };

  const renderTableView = (dataSource) => {
    if (!dataSource || dataSource.length === 0) {
      return <p className="text-center my-3">No data available.</p>;
    }

    // Get headers from the first item
    const headers = Object.keys(dataSource[0]);

    return (
      <div className="table-responsive">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th key={idx}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataSource.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {headers.map((header, cellIdx) => (
                  <td key={cellIdx}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  return (
    <Container fluid className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>wiki</h2>
      </div>
      
      {viewMode === 'table' ? (
        <>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="CARDS" title="CARDS">
              {loading ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                renderTableView(cards)
              )}
            </Tab>
            <Tab eventKey="theory" title="Theory">
              {loading ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                renderTableView(articles.theory)
              )}
            </Tab>
            <Tab eventKey="reporting" title="Reporting">
              {loading ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                renderTableView(articles.reporting)
              )}
            </Tab>
            <Tab eventKey="WHO" title="WHO">
              {loading ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                renderTableView(articles.who)
              )}
            </Tab>
          </Tabs>
        </>
      ) : (
        <>
          <SearchBar onSearch={handleSearch} />
          
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="Character" title="Characters">
              {renderCardContent('Character')}
            </Tab>
            <Tab eventKey="Political Party" title="Political Parties">
              {renderCardContent('Political Party')}
            </Tab>
            <Tab eventKey="Movement" title="Movements">
              {renderCardContent('Movement')}
            </Tab>
          </Tabs>
        </>
      )}

      {showForm && (
        <CardsForm
          show={showForm}
          onHide={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
      
      {renderCardContent(activeTab)}

      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <Button 
          variant="success" 
          onClick={() => setShowForm(true)}
          className="rounded-circle"
          style={{ width: '40px', height: '40px', fontSize: '20px', padding: 0 }}
        >
          +
        </Button>
      </div>
    </Container>
  );
  
  function renderCardContent(tabKey) {
    if (loading) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }
    
    const tabCards = filteredCards.filter(card => card.WHO_TYPE === tabKey);
    
    if (tabCards.length === 0) {
      return <p className="text-center my-5">No {tabKey} cards found.</p>;
    }
    
    return (
      <Row>
        {tabCards.map((card, index) => (
          <Col xs={12} sm={6} md={4} lg={3} key={index}>
            <CardView 
              card={card} 
              relatedArticles={getRelatedArticles(card.WHO)}
            />
          </Col>
        ))}
      </Row>
    );
  }
};

export default CardsPage;