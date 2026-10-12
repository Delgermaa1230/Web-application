//modeule/mo.mjs
import pg from 'pg';

import Moteacher from './moteacher.mjs';
import Mostudent from './mostudent.mjs';
import Mofeedback from './mofeedback.mjs';
import Molesson from './molesson.mjs';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set before starting the API');
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

client.connect()
  .then(() => console.log("PostgreSQL өгөгдлийн сан руу холбогдлоо"))
  .catch((err) => console.error("Холболтын алдаа", err.stack));

export default client;


const moTeacher=new Moteacher(client);
const moStudent=new Mostudent(client);
const moFeedback=new Mofeedback(client);
const moLesson=new Molesson(client);

export{moTeacher,moStudent,moFeedback, moLesson};
