require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Keep the private app access token in .env. Never commit it.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;

// The practicum custom object is expected to have these three properties.
// "name" must be a string property called Name in HubSpot.
const CUSTOM_PROPERTIES = ['name', 'author', 'genre','price'];

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// ROUTE 1 - Homepage: retrieve custom object records.
app.get('/', async (req, res) => {
    const customObjects = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;

    try {
        const response = await axios.get(customObjects, {
            headers,
            params: {
                properties: CUSTOM_PROPERTIES.join(',')
            }
        });

        const data = response.data.results || [];

        res.render('homepage', {
            title: 'Books | Integrating With HubSpot I Practicum',
            data
        });
    } catch (error) {
        console.error(
            'Unable to retrieve custom objects:',
            error.response?.data || error.message
        );
        res.status(500).send('Unable to retrieve custom object records.');
    }
});

// ROUTE 2 - Display the form for creating a new custom object record.
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// ROUTE 3 - Create a new custom object record and redirect home.
app.post('/update-cobj', async (req, res) => {
    const customObjects = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;

    const newRecord = {
        properties: {
            name: req.body.name,
            author: req.body.author,
            genre: req.body.genre,
            price: req.body.price
        }
    };

    try {
        await axios.post(customObjects, newRecord, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(
            'Unable to create custom object:',
            error.response?.data || error.message
        );
        res.status(500).send('Unable to create the custom object record.');
    }
});

// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
