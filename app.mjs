// app.mjs
import express from 'express';
import client from './db.mjs';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('hello world!');
});

app.get('/teachers', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM "Teacher"');
    res.json(result.rows);
  } catch (error) {
    console.error('Санал асуулга гүйцэтгэх алдаа', error.stack);
    res.status(500).send('Өгөгдлийн сангийн алдаа');
  }
});

app.listen(port, () => {
  console.log(`Сервер http://localhost:${port} дээр ажиллаж байна`);
});
