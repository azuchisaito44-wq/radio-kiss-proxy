const express = require('express');
const http = require('http');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.post('/stream', (req, res) => {
  const user = 'Ríos de agua';
  const pass = '12345678';
  const auth = Buffer.from(`${user}:${pass}`).toString('base64');

  const options = {
    hostname: 'live.radioking.com',
    port: 80,
    path: '/alternative-country-radio115',
    method: 'PUT',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
    }
  };

  const icecast = http.request(options);
  req.pipe(icecast);

  icecast.on('error', (e) => {
    console.error('Icecast error:', e.message);
    res.status(500).send('Error conectando a la emisora');
  });

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy corriendo en puerto ${PORT}`));
