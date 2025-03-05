import { getConnection } from '@/lib/db';

export default async function handler(req, res) {
  const { po } = req.query;

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('Po', po || null) // ส่งพารามิเตอร์ @Po
      .execute('iProgress-N'); // เรียก Stored Procedure
    const processedData = result.recordset.map((row, index) => ({
      ...row,
      id: `${row.iRoute}-${index}`,
      percentage: row.iTtote > 0 ? ((row.iTScan / row.iTtote) * 100).toFixed(0) : "0",
    }));
    res.status(200).json(processedData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data', details: error.message });
  }
}