# Wiki Ver8

## Overview

Wiki Ver8 is a Progressive Web Application (PWA) designed to serve as an interactive, structured wiki for documenting, categorizing, and exploring news and political content. The application is built with React for a modern user experience and leverages Google Sheets as a lightweight backend for real-time data synchronization.

The application is composed of four main components:

1. **Homepage (Theory Table):** Acts as a "read later" section where users can collect and organize theoretical items related to political and social entities. This feature allows users to delve into theoretical frameworks and texts at their convenience.

2. **Reporting Page (News Events Table):** This section is enhanced with two new fields, TIMELINE and SPECTRUM, which, when visualized using time.graphics, help users understand historical contexts and recollect events better. It provides a structured way to track and analyze news events and their implications over time.

3. **Cards Page (Entities Table):** Offers three distinct views, each dedicated to a specific entity type (e.g., people, political parties, movements). This feature displays cards for each entity, functioning similarly to a "pokedex," allowing users to explore and learn about different entities in a visually engaging manner.

4. **Instances Page:** Lists visible markers and instances of discrimination, exploitation, sexual harassment, abuse, domestic violence, state oppression, and other societal issues. This section aims to raise awareness and provide a comprehensive overview of such instances, facilitating better understanding and advocacy.

Overall, Wiki Ver8 aims to create a comprehensive platform for users to interact with and analyze political and news content, offering both depth and breadth in its exploration of theoretical and real-world events.

## Table of Contents
- [File Hierarchy](#file-hierarchy)
- [Installation Instructions](#installation-instructions)
- [Usage Instructions](#usage-instructions)
- [Features](#features)
- [Table Structure and Alignment](#table-structure-and-alignment)
- [Contributing](#contributing)
- [License](#license)

## File Hierarchy
C:\
 └── local\
     └── SOFTWARE_DEV\
         └── newsagg_projects\
             └── ver-8\
                 ├── .env
                 ├── .git\
                 ├── .gitignore
                 ├── README.md
                 ├── build\
                 ├── config-overrides.js
                 ├── node_modules\
                 ├── package-lock.json
                 ├── package.json
                 ├── public\
                 │   ├── index.html
                 │   ├── manifest.json
                 │   └── service-worker.js
                 └── src\
                     ├── App.css
                     ├── App.js
                     ├── api\
                     │   └── googleSheetsApi.js
                     ├── components\
                     │   ├── ArticleCard.js
                     │   ├── ArticleReader.js
                     │   ├── CardView.js
                     │   ├── FloatingButton.js
                     │   ├── Header.js
                     │   ├── NotionMultiSelect.css
                     │   ├── NotionMultiSelect.js
                     │   ├── SearchBar.js
                     │   └── forms\
                     │       ├── CardsForm.js
                     │       ├── EntryForm.js
                     │       ├── InstancesForm.js
                     │       └── ReportingForm.js
                     ├── index.css
                     ├── index.js
                     ├── pages\
                     │   ├── CardsPage.js
                     │   ├── HomePage.js
                     │   ├── InstancesPage.js
                     │   └── ReportingPage.js
                     └── serviceWorkerRegistration.js
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

## Table Structure and Alignment
### 1. Entities Table
**Schema**
- `entity_id`: Unique identifier for each entity (auto-generated).
- `WHO`: Multi-select field for entity names.
- `bio`: Biographical information about the entity.
- `entity_type`: Type of entity (Character, Party, Movement).
- `SPECTRUM`: Political spectrum (LEFT, CENTRE, RIGHT).

**Dynamic Form Structure**
The `CardsForm` is designed to manage entity data, providing a dynamic interface for entity categorization:
- **entity_id** (text input): Unique identifier for the entity (auto-generated).
- **WHO** (multi-select): Allows selection of entity names using NotionMultiSelect.
- **Bio** (text input): Biographical information about the entity.
- **Entity Type** (dropdown): Categorizes the entity type.
  - Options: Character, Party, Movement
- **Spectrum** (dropdown): Political spectrum categorization.
  - Options: Left, Centre, Right

**Google Sheets API**: 
- `addRowToEntitiesTable`: Handles adding rows to the `entities` sheet.
- [Code Reference](cci:1://file:///c:/local/SOFTWARE_DEV/newsagg_projects/ver-8/src/api/googleSheetsApi.js:195:0-219:2)


### 2. Theory Table
**Schema**
- `WHO`: Name of the entity.
- `title`: Title of the theory.
- `description`: Detailed theoretical text.
- `author`: Author or source of the theory.
- `abstract`: Brief summary of the theory.
- `publication_date`: Date of publication.
- `src_type`: Type of source (post, article, book, pdf).
- `platform`: Platform where the post was published (if src_type is post).
- `domain`: Domain of the article (if src_type is article).
- `keywords`: Multi-select field for keywords.
- `spectrum`: Political spectrum (LEFT, CENTRE, RIGHT).
- `url`: URL of the source.

**Dynamic Form Structure**
The `EntryForm` dynamically adjusts its fields based on the selected `Source Type`. It supports various categories, each with specific fields:
- **Source Type** (dropdown): Determines the fields displayed in the form.
  - Options: Social Media Post, Article, Book, PDF
- **Title** (text input): Title of the entry.
- **Post Content** (text area): Visible only when `Source Type` is 'Social Media Post'.
- **Keywords** (multi-select): Allows selection of multiple keywords.
- **URL** (URL input): Required for all source types.
- **Platform** (dropdown): Visible only when `Source Type` is 'Social Media Post'.
  - Options: Facebook, Instagram, Twitter, YouTube
- **Author** (multi-select): Allows selection of multiple authors when `Source Type` is 'Social Media Post'.
- **Abstract** (text area): Visible for 'Article', 'Book', and 'PDF' source types.
- **WHO** (multi-select): Allows selection of related entities.
- **Spectrum** (dropdown): Political spectrum categorization.
  - Options: Left, Centre, Right
- **Date Published** (date input): Date when the entry was published.

**Google Sheets API**: 
- `addRowToTheoryTable`: Handles adding rows to the `theory` sheet.
- [Code Reference](cci:1://file:///c:/local/SOFTWARE_DEV/newsagg_projects/ver-8/src/api/googleSheetsApi.js:220:0-250:2)


### 3. Reporting Table
**Schema**
- `headline`: Headline of the news event.
- `description`: Detailed description of the event.
- `event_date`: Date of the event.
- `reporting_date`: Date the event was reported.
- `src_type`: Type of source (post, article).
- `platform`: Platform where the post was published (if src_type is post).
- `spectrum`: Political spectrum (LEFT, CENTRE, RIGHT).
- `WHO`: Name of the entity.
- `event_type_tag`: Type of event.
- `location`: Location of the event.
- `source_link`: URL of the source.
**Dynamic Form Structure**
The `ReportingForm` dynamically adapts based on the `Source Type` and includes fields to capture detailed reporting information:
- **Source Type** (dropdown): Determines the fields displayed in the form.
  - Options: Social Media Post, Article
- **Headline** (text input): Headline of the news event.
- **Post Content** (text area): Visible only when `Source Type` is 'Social Media Post'.
- **Region** (multi-select): Allows selection of multiple regions.
- **Spectrum** (dropdown): Political spectrum categorization.
  - Options: Left, Centre, Right
- **Author** (text input): Author of the report.
- **URL** (URL input): Source link for the report.
- **WHO** (multi-select): Allows selection of related entities.
- **Date Published** (date input): Date when the report was published.
- **Event Type Tag** (dropdown): Categorizes the type of event.

**Google Sheets API**: `addRowToReportingTable`
- `addRowToReportingTable`: Handles adding rows to the `reporting` sheet.
- [Code Reference](cci:1://file:///c:/local/SOFTWARE_DEV/newsagg_projects/ver-8/src/api/googleSheetsApi.js:251:0-280:2)

### 4. Instances Table
**Schema**
- `INSTANCE_TYPE`: Type of instance (discrimination, sexual_abuse, exploitation, state_violence, state_sponsored_terrorism, religious_stupidity).
- `HEADLINE`: Headline of the instance.
- `POST_CONTENT`: Detailed description of the instance.
- `LOCATION`: Location of the instance.
- `DATE_REPORTED`: Date the instance was reported.
- `URL`: URL of the source.
- `SPECTRUM`: Political spectrum (LEFT, CENTRE, RIGHT).

**Dynamic Form Structure**
The `InstancesForm` captures instances of societal issues, dynamically structured to ensure comprehensive data entry:
- **Instance Type** (dropdown): Categorizes the type of instance.
  - Options: Discrimination, Sexual Abuse, Exploitation, State Violence, State Sponsored Terrorism, Religious Stupidity
- **Headline** (text input): Headline summarizing the instance.
- **Post Content** (text area): Detailed description of the instance.
- **Location** (multi-select): Allows selection of multiple locations using NotionMultiSelect.
- **Date Reported** (date input): Date when the instance was reported.
- **URL** (URL input): Source link for the instance.
- **Spectrum** (dropdown): Political spectrum categorization.
  - Options: Left, Centre, Right

**Google Sheets API**: [addRowToInstancesTable](cci:1://file:///c:/local/SOFTWARE_DEV/newsagg_projects/ver-8/src/api/googleSheetsApi.js:221:0-238:2)
  - Handles adding rows to the `instances` sheet.

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.