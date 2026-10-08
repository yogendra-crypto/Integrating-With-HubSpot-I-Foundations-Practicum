# Integrating With HubSpot I: Foundations Practicum

This repository is for the Integrating With HubSpot I: Foundations practicum.

## Custom object

Custom object: Books

Properties:
- Name
- Author
- Genre
- Price

HubSpot custom object list URL:

`PASTE_YOUR_TEST_ACCOUNT_CUSTOM_OBJECT_LIST_URL_HERE`

## Local setup

Create a `.env` file in the project root:

```env
PRIVATE_APP_ACCESS=YOUR_PRIVATE_APP_ACCESS_TOKEN
CUSTOM_OBJECT_TYPE=YOUR_CUSTOM_OBJECT_TYPE
```

Do not commit `.env` or your private app access token.

Install dependencies:

```bash
npm install
```

Run the application:

```bash
node index.js
```

Then open:

`http://localhost:3000`
