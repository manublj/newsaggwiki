import axios from 'axios';

const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

// Mock data for development and testing
const MOCK_DATA = {
  entities: [],
  theory: [],
  reporting: [],
  eventtypetags: [],
  instances: [],
  cards: []
};

// Define the expected headers for each table in the database schema
export const getTableHeaders = (tableName) => {
  switch (tableName.toLowerCase()) {
    case 'entities':
      return [
        'entity_id',
        'name',
        'entity_type',
        'description',
        'created_at'
      ];
    case 'theory':
      return [
        'theory_id',
        'title',
        'description',
        'author',
        'publication_date',
        'src_type',
        'platform',
        'domain',
        'keyword_tags',
        'spectrum',
        'category',
        'entity_id',
        'references'
      ];
    case 'reporting':
      return [
        'report_id',
        'title',
        'description',
        'event_date',
        'reporting_date',
        'src_type',
        'platform',
        'spectrum',
        'category',
        'entity_id',
        'event_type_tag',
        'location',
        'source_link'
      ];
    case 'eventtypetags':
      return [
        'tag_id',
        'tag_name',
        'tag_category',
        'entity_type',
        'parent_tag',
        'description'
      ];
    case 'reportingeventtype':
      return [
        'report_id',
        'tag_id'
      ];
    case 'instances':
      return [
        'instance_id',
        'title',
        'description',
        'instance_type',
        'date_reported',
        'location',
        'source_link',
        'entity_id'
      ];
    default:
      return [];
  }
};

// Map database field names to UI field names
const mapDbFieldsToUiFields = (tableName, dbData) => {
  if (tableName.toLowerCase() === 'theory') {
    return {
      id: dbData.theory_id || '',
      HEADLINE: dbData.title || '',
      ABSTRACT: dbData.description || '',
      AUTHOR: dbData.author || '',
      DATE_PUBLISHED: dbData.publication_date || '',
      SOURCE_TYPE: dbData.src_type || '',
      PLATFORM: dbData.platform || '',
      DOMAIN: dbData.domain || '',
      KEYWORDS: dbData.keyword_tags || '',
      SPECTRUM: dbData.spectrum || '',
      CATEGORY: dbData.category || 'theory',
      WHO: dbData.entity_id || '',
      URL: dbData.references || ''
    };
  } else if (tableName.toLowerCase() === 'reporting') {
    return {
      id: dbData.report_id || '',
      HEADLINE: dbData.title || '',
      POST_CONTENT: dbData.description || '',
      DATE_PUBLISHED: dbData.event_date || '',
      SOURCE_TYPE: dbData.src_type || '',
      PLATFORM: dbData.platform || '',
      SPECTRUM: dbData.spectrum || '',
      CATEGORY: dbData.category || 'reporting',
      WHO: dbData.entity_id || '',
      REGION: dbData.location || '',
      URL: dbData.source_link || ''
    };
  } else if (tableName.toLowerCase() === 'instances') {
    return {
      id: dbData.instance_id || '',
      HEADLINE: dbData.title || '',
      POST_CONTENT: dbData.description || '',
      INSTANCE_TYPE: dbData.instance_type || '',
      DATE_REPORTED: dbData.date_reported || '',
      LOCATION: dbData.location || '',
      URL: dbData.source_link || '',
      WHO: dbData.entity_id || '',
      CATEGORY: 'instances'
    };
  } else {
    // For entities and other tables, return as is
    return dbData;
  }
};

// Function to get data from a specific table
export const getTableData = async (tableName) => {
  // Always use mock data for now
  console.log(`Using mock data for ${tableName}`);
  
  // Return mock data for the requested table
  const mockDataForTable = MOCK_DATA[tableName.toLowerCase()] || [];
  
  // Map the mock data to UI fields if needed
  return mockDataForTable.map(item => mapDbFieldsToUiFields(tableName, item));
};

// Function to add a row to a table
export const addRowToTable = async (tableName, rowData) => {
  try {
    console.log(`Adding row to ${tableName} table:`, rowData);
    
    // Simulate successful add with mock data
    console.log('Simulating successful add with mock data');
    alert(`Data saved to ${tableName} table successfully (mock).`);
    
    // Return a success response
    return {
      success: true,
      message: 'Row added successfully (mock)',
      data: { ...rowData, id: `mock_${Date.now()}` }
    };
  } catch (error) {
    console.error('Error adding row to table:', error);
    alert(`Error saving data: ${error.message}`);
    throw error;
  }
};

// For backward compatibility
export const getSheetHeaders = getTableHeaders;
export const getSheetData = getTableData;
export const addRowToSheet = addRowToTable;