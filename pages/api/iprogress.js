import { getConnection } from '@/lib/db';

export default async function handler(req, res) {
  try {
    const pool = await getConnection();
    const result = await pool.request().execute('iProgress');
    const processedData = result.recordset.map((row) => ({
      ...row,
      percentage: ((row.iTScan / row.iTtote) * 100).toFixed(2),
    }));
    res.status(200).json(processedData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data', details: error.message });
  }
}