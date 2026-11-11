require('dotenv').config();

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Keep the fields in one place so the table and form stay in sync.
const OBJECT_PROPERTIES = ['name', 'species', 'age'];

app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

function createHubSpotClient() {
  const accessToken = process.env.PRIVATE_APP_ACCESS;
  const objectType = process.env.CUSTOM_OBJECT_TYPE;
  const apiBaseUrl = process.env.HUBSPOT_API || 'https://api.hubapi.com';

  if (!accessToken || !objectType) {
    throw new Error(
      'Missing HubSpot settings. Add PRIVATE_APP_ACCESS and CUSTOM_OBJECT_TYPE to your .env file.'
    );
  }

  return axios.create({
    baseURL: `${apiBaseUrl}/crm/v3/objects/${objectType}`,
    timeout: 15000,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
}

const hubspot = createHubSpotClient();

function getHubSpotErrorMessage(error) {
  const responseMessage = error.response?.data?.message;
  return responseMessage || 'Something went wrong while contacting HubSpot. Please try again.';
}

// Show the existing custom object records.
app.get('/', async (req, res, next) => {
  try {
    const response = await hubspot.get('', {
      params: { properties: OBJECT_PROPERTIES.join(',') },
    });

    res.render('homepage', {
      title: 'Custom Object Records',
      records: response.data.results || [],
      error: null,
    });
  } catch (error) {
    next(error);
  }
});

// Display the form used to create a new record.
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Add a Custom Object Record',
    properties: OBJECT_PROPERTIES,
    error: null,
  });
});

// Send the form values to HubSpot as a new custom object record.
app.post('/update-cobj', async (req, res, next) => {
  const properties = {};

  for (const property of OBJECT_PROPERTIES) {
    const value = String(req.body[property] || '').trim();

    if (!value) {
      return res.status(400).render('updates', {
        title: 'Add a Custom Object Record',
        properties: OBJECT_PROPERTIES,
        error: `Please enter a value for ${property}.`,
      });
    }

    properties[property] = value;
  }

  try {
    await hubspot.post('', { properties });
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

// Keep error responses readable without exposing stack traces or credentials.
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.response?.status || 500;
  const message = getHubSpotErrorMessage(error);

  console.error('HubSpot request failed:', {
    status: statusCode,
    message,
  });

  res.status(statusCode).render('error', {
    title: 'Unable to complete the request',
    message,
  });
});

app.listen(PORT, () => {
  console.log(`The app is running at http://localhost:${PORT}`);
});
