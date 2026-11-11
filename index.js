require('dotenv').config();
const express = require('express');
const axios = require('axios');

const PROPS = ['name', 'species', 'age'];

const hubspot = axios.create({
  baseURL: `${process.env.HUBSPOT_API || 'https://api.hubapi.com'}/crm/v3/objects/${process.env.CUSTOM_OBJECT_TYPE}`,
  headers: { Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}` },
});

const app = express();
app.set('view engine', 'pug');
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));

// Express 4 does not catch rejected promises, so route them to the error handler.
const wrap = (fn) => (req, res, next) => fn(req, res).catch(next);

app.get('/', wrap(async (req, res) => {
  const { data } = await hubspot.get('', { params: { properties: PROPS.join(',') } });
  res.render('homepage', { title: 'Custom Object Table', records: data.results.map((r) => r.properties) });
}));

app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', props: PROPS });
});

app.post('/update-cobj', wrap(async (req, res) => {
  const properties = Object.fromEntries(PROPS.map((p) => [p, req.body[p]]));
  await hubspot.post('', { properties });
  res.redirect('/');
}));

app.use((err, req, res, next) => {
  res.status(500).send(err.response?.data?.message || err.message);
});

app.listen(3000, () => console.log('http://localhost:3000'));
