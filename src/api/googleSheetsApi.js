import axios from 'axios';

const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

// Mock data for development and testing
const MOCK_DATA = {
  ENTITIES: [],
  THEORY: [],
  REPORTING: [],
  EVENTTYPETAGS: [],
  INSTANCES: [],
};

// Define the expected headers for each table in the database schema
export const getTableHeaders = (tableName) => {
  switch (tableName.toUpperCase()) {
    case 'ENTITIES':
      return [
        'entity_id',
        'name',
        'entity_type',
        'description',
        'created_at'
      ];
    case 'THEORY':
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
    case 'REPORTING':
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
    case 'EVENTTYPETAGS':
      return [
        'tag_id',
        'tag_name',
        'tag_category',
        'entity_type',
        'parent_tag',
        'description'
      ];
    case 'REPORTINGEVENTTYPE':
      return [
        'report_id',
        'tag_id'
      ];
    case 'INSTANCES':
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
  if (tableName.toUpperCase() === 'THEORY') {
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
  } else if (tableName.toUpperCase() === 'REPORTING') {
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
  } else if (tableName.toUpperCase() === 'INSTANCES') {
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
  } else if (tableName.toUpperCase() === 'ENTITIES') {
    return {
      id: dbData.card_id || '',
      HEADLINE: dbData.title || '',
      POST_CONTENT: dbData.description || '',
      INSTANCE_TYPE: dbData.instance_type || '',
      DATE_REPORTED: dbData.date_reported || '',
      LOCATION: dbData.LOCATION || '',
      URL: dbData.source_link || '',
      WHO: dbData.WHO || '',
      CATEGORY: 'entities'
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
  const mockDataForTable = MOCK_DATA[tableName.toUpperCase()] || [];
  
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

// Function to add a row to the ENTITIES table
export const addRowToEntitiesTable = async (data) => {
  const { WHO, LOCATION, ...rest } = data;
  // Process WHO and LOCATION as needed
  // For example, convert WHO and LOCATION to arrays if they are not already
  const processedWho = Array.isArray(WHO) ? WHO : [WHO];
  const processedLocation = Array.isArray(LOCATION) ? LOCATION : [LOCATION];
  
  // Add row to the ENTITIES table
  const response = await fetch(`${BASE_URL}/${SPREADSHEET_ID}/values/ENTITIES!A1:Z1000?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      "majorDimension": "ROWS",
      "range": "ENTITIES!A1:Z1000",
      "values": [Object.values({ ...rest, WHO: processedWho.join(','), LOCATION: processedLocation.join(',') })]
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to add row to ENTITIES table');
  }
};

// Add a function to save data to the instances table
export const addRowToInstancesTable = async (data) => {
  const response = await fetch(`${BASE_URL}/${SPREADSHEET_ID}/values/INSTANCES!A1:Z1000?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      "majorDimension": "ROWS",
      "range": "INSTANCES!A1:Z1000",
      "values": [Object.values(data)]
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to add row to instances table');
  }
};

// Add a function to save data to the theory table
export const addRowToTheoryTable = async (data) => {
  const row = {
    theory_id: data.theory_id,
    title: data.title,
    description: data.description,
    keywords: data.keywords.join(','),
    authors: data.authors.join(','),
    domains: data.domains.join(',')
  };
  await addRowToTable('THEORY', row);
};

// Add a function to save data to the reporting table
export const addRowToReportingTable = async (data) => {
  const row = {
    report_id: data.report_id,
    headline: data.headline,
    content: data.content,
    entities: data.entities.join(','),
    regions: data.regions.join(',')
  };
  await addRowToTable('REPORTING', row);
};

// For backward compatibility
export const getSheetHeaders = getTableHeaders;
export const getSheetData = getTableData;
export const addRowToSheet = addRowToTable;