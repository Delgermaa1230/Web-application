// app.mjs
import express from 'express';
import client from './db.mjs';
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware
app.use(cors());  // CORS зөвшөөрөх
app.use(express.json());  // JSON body parser

// Root endpoint
app.get('/', (req, res) => {
  res.send('hello world!');
});

// Бүх багш нарын мэдээлэл авах
app.get('/teachers', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM "Teacher"');
    res.json(result.rows);
  } catch (error) {
    console.error('Санал асуулга гүйцэтгэх алдаа', error.stack);
    res.status(500).send('Өгөгдлийн сангийн алдаа');
  }
});

// ID-аар багшийн мэдээлэл авах
app.get('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.query('SELECT * FROM "Teacher" WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      res.status(404).send('Багш олдсонгүй');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).send('Өгөгдлийн сангийн алдаа');
  }
});

// Шинэ багш бүртгэх
app.post('/teachers', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      image,
      ratings,
      number_of_ratings,
      description,
      lessons
    } = req.body;

    const result = await client.query(
      'INSERT INTO "Teacher" (first_name, last_name, email, password, image, ratings, number_of_ratings, description, lessons) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [first_name, last_name, email, password, image, ratings, number_of_ratings, description, lessons]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).send('Өгөгдлийн сангийн алдаа');
  }
});

// Багшийн мэдээлэл шинэчлэх
app.put('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      password,
      image,
      ratings,
      number_of_ratings,
      description,
      lessons
    } = req.body;

    const result = await client.query(
      'UPDATE "Teacher" SET first_name = $1, last_name = $2, email = $3, password = $4, image = $5, ratings = $6, number_of_ratings = $7, description = $8, lessons = $9 WHERE id = $10 RETURNING *',
      [first_name, last_name, email, password, image, ratings, number_of_ratings, description, lessons, id]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Багш олдсонгүй');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).send('Өгөгдлийн сангийн алдаа');
  }
});

// Багшийн мэдээлэл устгах
app.delete('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.query('DELETE FROM "Teacher" WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      res.status(404).send('Багш олдсонгүй');
    } else {
      res.json({ message: 'Амжилттай устгагдлаа', deletedTeacher: result.rows[0] });
    }
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).send('Өгөгдлийн сангийн алдаа');
  }
});

// Server эхлүүлэх
app.listen(port, () => {
  console.log(`Сервер http://localhost:${port} дээр ажиллаж байна`);
});
