import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CardsPage from './pages/CardsPage';
import ReportingPage from './pages/ReportingPage';
import InstancesPage from './pages/InstancesPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  useEffect(() => {
    // Removed the call to initializeSheetHeaders
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <Container fluid className="p-0 main-content">
          <Routes>
            <Route path="/" element={<HomePage />} /> 
            <Route path="/reporting" element={<ReportingPage />} />
            <Route path="/wiki" element={<CardsPage />} /> 
            <Route path="/instances" element={<InstancesPage />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;