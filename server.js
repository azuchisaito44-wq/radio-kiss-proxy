Ahora pega este código completo:

```js
const express = require('express');
const http = require('http');
const https = require('https');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.post('/stream', (req, res) => {
  const { server, port, mount, user, pass } = req.query;
  if (!server || !mount) return res.status(400).send('Faltan parametros');

  const auth = Buffer.from(`${user}:${pass}`).toString('base64');
  const options = {
    hostname: server,
    port: parseInt(port) || 80,
    path: mount,
    method: 'PUT',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
      'Icy-Name': 'Radio Kiss',
      'Icy-Genre': 'Various',
      'Icy-Pub': '1',
      'User-Agent': 'RadioProxy/1.0',
    }
  };

  const proto = (parseInt(port) === 443) ? https : http;
  const icecast = proto.request(options, (iceRes) => {
    console.log('Icecast response:', iceRes.statusCode);
  });

  icecast.on('error', (e) => {
    console.error('Icecast error:', e.message);
  });

  req.pipe(icecast);
  req.on('end', () => icecast.end());
  res.sendStatus(200);
});

app.get('/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy corriendo en puerto ${PORT}`));
```

Dime cuando lo hayas pegado.
