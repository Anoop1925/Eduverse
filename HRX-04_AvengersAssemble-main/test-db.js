const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:EduVersehrx04@db.gcpjkejmgxykhwvhbmnw.supabase.co:5432/postgres'
});
client.connect()
  .then(() => {
    console.log('Connected!');
    return client.end();
  })
  .catch(err => {
    console.error('Connection error:', err);
  });