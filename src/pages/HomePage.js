import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Table } from 'react-bootstrap';
import ArticleCard from '../components/ArticleCard';
import EntryForm from '../components/forms/EntryForm';
import SearchBar from '../components/SearchBar';
import { getSheetData } from '../api/googleSheetsApi';

const HomePage = () => {
  const [articles, setArticles] = useState({ theory: [], reporting: [] });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('theory');

  useEffect(() => {
    fetchAllArticles();
  }, []);

  const fetchAllArticles = async () => {
    try {
      setLoading(true);
      const theoryData = await getSheetData('theory').catch(err => {
        console.warn('Error fetching theory data:', err);
        return [];
      });
      
      const reportingData = await getSheetData('reporting').catch(err => {
        console.warn('Error fetching reporting data:', err);
        return [];
      });
      
      setArticles({
        theory: theoryData || [],
        reporting: reportingData || []
      });
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredArticles = articles[activeCategory].filter(article => {
    if (!searchQuery) return true;
    const searchFields = [
      article.HEADLINE,
      article.AUTHOR,
      article.DOMAIN,
      article.WHO,
      article.KEYWORDS,
      article.HIGHLIGHTS || '',
      article.POST_CONTENT || '',
      article.REGION || '',
      article.SRC_TYPE || ''
    ];
    return searchFields.some(field => 
      field && field.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const renderTableView = () => {
    const dataSource = articles[activeCategory];
    if (!dataSource || dataSource.length === 0) {
      return <p className="text-center my-3">No data available.</p>;
    }
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
                  <td key={cellIdx}>{row[header] || ''}</td>
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
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <Button 
            variant="primary" 
            onClick={() => setShowForm(true)}
            className="rounded-circle d-none d-md-block"
            style={{ position: 'fixed', bottom: '20px', right: '20px', width: '50px', height: '50px', fontSize: '24px' }}
          >
            +
          </Button>
          <Button 
            variant="primary" 
            onClick={() => setShowForm(true)}
            className="rounded-circle d-block d-md-none"
            style={{ position: 'fixed', bottom: '20px', right: '20px', width: '40px', height: '40px', fontSize: '18px' }}
          >
            +
          </Button>
        </div>
      </div>
      <SearchBar onSearch={handleSearch} />
      <Row>
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          renderTableView()
        )}
      </Row>
      <EntryForm 
        show={showForm} 
        onHide={() => setShowForm(false)}
        onSubmit={() => {
          setShowForm(false);
          fetchAllArticles();
        }}
        initialData={{ CATEGORY: 'theory' }}
      />
    </Container>
  );
};

export default HomePage;