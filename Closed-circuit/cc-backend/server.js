import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = await mysql.createPool({
  host: 'localhost',
  user: 'ramesh',
  password: 'Great@123',
  database: 'cc_db',
});

// API to save contact
app.post('/api/contact', async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      emailId,
      town,
      state,
      country,
      lookingFor,
      preferredContactMethod,
      preferredDate,
      preferredTime,
      description,
    } = req.body;

    await db.query(
      `INSERT INTO contacts 
      (fullName, mobileNumber, emailId, town, state, country, lookingFor, preferredContactMethod, preferredDate, preferredTime, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullName,
        mobileNumber,
        emailId,
        town,
        state,
        country,
        lookingFor,
        preferredContactMethod,
        preferredDate,
        preferredTime,
        description,
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.listen(5000, () => {
  console.log('Backend running on port 5000');
});
