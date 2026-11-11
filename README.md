# HubSpot Custom Object Demo

A small Express application that reads custom object records from HubSpot and lets you create a new record through a web form.

## Requirements

- Node.js 18 or later
- A HubSpot private app access token with permission to read and create records for the selected custom object
- The HubSpot custom object type ID or fully qualified object type name

## Setup

1. Install the project dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

3. Open `.env` and add your HubSpot settings:

   ```dotenv
   PRIVATE_APP_ACCESS=your_private_app_access_token
   CUSTOM_OBJECT_TYPE=your_custom_object_type
   ```

   Keep `.env` private. It is excluded from Git and should not be shared with the project.

4. Start the app:

   ```bash
   npm start
   ```

5. Visit [http://localhost:3000](http://localhost:3000).

## Pages and routes

- `GET /` fetches custom object records and displays them in a table.
- `GET /update-cobj` displays the create-record form.
- `POST /update-cobj` validates the submitted fields and creates a record in HubSpot.

The fields used by the example are `name`, `species`, and `age`. If your HubSpot custom object uses different property names, update `OBJECT_PROPERTIES` in `index.js` to match.

## Project structure

```text
 iwh-demo/
 ├── index.js
 ├── package.json
 ├── .env.example
 ├── public/
 │   └── css/
 │       └── style.css
 └── views/
     ├── error.pug
     ├── homepage.pug
     └── updates.pug
```

## Notes

The app uses one Axios client for HubSpot requests. HubSpot API errors are passed to Express error-handling middleware and shown as a readable message. The access token is read from the local environment and is never included in the source code.
