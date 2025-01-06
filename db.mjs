// db.mjs
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'webapp',
  password: 'root',
  port: 5432,
});

client.connect()
  .then(() => console.log("PostgreSQL өгөгдлийн сан руу холбогдлоо"))
  .catch((err) => console.error("Холболтын алдаа", err.stack));

export default client;
