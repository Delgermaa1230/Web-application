//modeule/mo.mjs
import pg from 'pg';

import Moteacher from './moteacher.mjs';
import Mostudent from './mostudent.mjs';

const client = new pg.Client({
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


const moTeacher=new Moteacher(client);
const moStudent=new Mostudent(client);
export{moTeacher,moStudent}