import { getConnection, sql } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed', method: req.method });
  }

  const { iDate } = req.query;
  console.log('Received iDate:', iDate);
  

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('iDate', sql.Date, iDate || null) // ส่ง null ถ้าไม่ระบุ iDate
      .execute('iNotShipCN-N');
    console.log('Rows returned:', result.recordset.length);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Error fetching data', details: error.message });
  }
}