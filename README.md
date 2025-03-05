# Wiki Ver8

## Overview

Wiki Ver8 is a Progressive Web Application (PWA) designed as an interactive, structured wiki for documenting, categorizing, and exploring news and political content. It leverages Google Sheets as a lightweight backend database and uses React on the frontend to ensure a fluid, modern user experience.

## Table of Contents
- [File Hierarchy](#file-hierarchy)
- [Installation Instructions](#installation-instructions)
- [Usage Instructions](#usage-instructions)
- [Features](#features)
- [Database Schema](#database-schema)
- [EntryForm Structure](#entryform-structure)
- [Contributing](#contributing)
- [License](#license)

## File Hierarchy
```
project-root/
├── src/
│   ├── api/
│   │   └── googleSheetsApi.js
│   ├── components/
│   │   ├── Header.js
│   │   ├── forms/
│   │   │   ├── EntryForm.js
│   │   │   ├── ReportingForm.js
│   │   │   └── CardsForm.js
│   │   └── ArticleCard.js
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── ReportingPage.js
│   │   └── CardsPage.js
│   └── App.js
├── public/
│   └── index.html
├── package.json
└── README.md
```

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/yourproject.git
   cd yourproject
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage Instructions
1. Start the development server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000`.

## Features
- **Article Feed:** Displays a curated feed of political and general news articles categorized as THEORY or REPORTING.
- **Reading Mode:** Offers an enhanced reading interface that parses articles using the Readability API, making text easier to digest.
- **Highlighting & Floating Icons:** Enables users to highlight sections of text; these highlights are then visually represented as floating icons both in the article view and on the homepage feed.
- **Dynamic Content Addition:** A floating 'Add' button lets users input new data. The input form adapts based on the content category selected (THEORY, REPORTING, or INSTANCES).
- **Google Sheets Integration:** All data is stored and updated dynamically in Google Sheets, ensuring real-time synchronization across the application.
- **Entity-based Organization:** Articles, reports, and instances are categorized by entities (e.g., people, political parties, movements).
- **Offline Functionality:** Utilizes Progressive Web App capabilities for offline access.
- **Complete Table Views:** View complete database tables for all Google Sheets data.
- **Reported Instances:** Track and categorize reported instances of discrimination, sexual abuse, and exploitation.

## Database Schema
The application uses a comprehensive database schema to support both theoretical and reported events related to political entities. 

### 1. Entities Table
**Purpose:** Acts as a master table for all political or social entities.
**Key Columns:**
- `entity_id`: Unique identifier for each entity.
- `name`: Name of the entity.
- `entity_type`: Type of entity (person, political_party, movement).
- `description`: Optional detailed description.
- `created_at`: Timestamp of record creation.

### 2. Theory Table
**Purpose:** Stores theoretical texts or frameworks related to entities.
**Key Columns:**
- `theory_id`: Unique identifier for each theoretical entry.
- `title`: Title of the theory.
- `description`: Detailed theoretical text.
- `author`: Author or source of the theory.
- `publication_date`: Date of publication.
- `src_type`: Type of source (post, article).

## EntryForm Structure
The EntryForm component is designed to handle different categories of entries dynamically. Below are the form structures for each category:

### When `CATEGORY = theory`
- **Source Type** (dropdown):
  - Social Media Post
  - Article
  - Book
  - PDF
- **Headline** (text input)
- **Post Content** (text input, shown only if Source Type is 'Social Media Post')
- **Author** (text input)
- **Domain** (text input, shown only if Source Type is 'Article')
- **URL** (URL input)
- **WHO** (multi-select)
- **WHO_TYPE** (dropdown):
  - Character
  - Political Party
  - Movement
- **Spectrum** (dropdown):
  - Left
  - Centre
  - Right
- **Keywords** (text input)

### When `CATEGORY = reporting`
- **Source Type** (dropdown):
  - Social Media Post
  - Article
- **Headline** (text input)
- **Post Content** (text input, shown only if Source Type is 'Social Media Post')
- **Region** (text input)
- **Spectrum** (dropdown):
  - Left
  - Centre
  - Right
- **Author** (text input)
- **URL** (URL input)
- **WHO** (multi-select)
- **WHO_TYPE** (dropdown):
  - Character
  - Political Party
  - Movement
- **Date Published** (date input)

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.