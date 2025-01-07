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

app.post('/students', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone
    } = req.body;

    // Check if email already exists
    const emailCheck = await client.query(
      'SELECT * FROM "Student" WHERE email = $1',
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Мэйл хаяг бүртгэлтэй байна' });
    }

    const result = await client.query(
      'INSERT INTO "Student" (first_name, last_name, email, password, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [first_name, last_name, email, password, phone]
    );

    res.status(201).json({ 
      message: 'Амжилттай бүртгэгдлээ',
      student: result.rows[0]
    });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: 'Өгөгдлийн сангийн алдаа' });
  }
});

// Student нэвтрэх
app.post('/students/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await client.query(
      'SELECT * FROM "Student" WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Мэйл эсвэл нууц үг буруу байна' });
    }

    res.json({ 
      message: 'Амжилттай нэвтэрлээ',
      student: result.rows[0]
    });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: 'Өгөгдлийн сангийн алдаа' });
  }
});

// Server эхлүүлэх
app.listen(port, () => {
  console.log(`Сервер http://localhost:${port} дээр ажиллаж байна`);
});