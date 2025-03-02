const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.use(express.json());

app.all('*', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const targetUrl = `https://fq5r6s7t8u9v0wl.clarocdn.com.br${url.pathname}${url.search}`;

  const modifiedHeaders = new fetch.Headers(req.headers);
  modifiedHeaders.set('Origin', 'https://www.clarotvmais.com.br');
  modifiedHeaders.set('Referer', 'https://www.clarotvmais.com.br/');
  modifiedHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36');

  const modifiedRequest = {
    method: req.method,
    headers: modifiedHeaders,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : null,
    redirect: 'follow'
  };

  let response = await fetch(targetUrl, modifiedRequest);

  // Clone the response to modify the headers
  const responseBody = await response.text();
  const responseHeaders = Object.fromEntries(response.headers.entries());

  responseHeaders['Access-Control-Allow-Origin'] = '*';
  responseHeaders['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
  responseHeaders['Access-Control-Allow-Headers'] = '*';

  res.status(response.status)
     .set(responseHeaders)
     .send(responseBody);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});