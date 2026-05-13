const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.post('/stream', (req, res) => {
  const { server, port, mount, user, pass } = req.query;
  const url = `http://${server}:${port}${mount}`;
  const auth = Buffer.from(`${user}:${pass}`).toString('base64');
  fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'audio/mpeg',
      'Icy-Name': 'Radio Kiss',
    },
    body: req,
  }).catch(console.error);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy en puerto ${PORT}`));
