// lib/db.js
import sql from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false, 
    trustServerCertificate: true,
  },
  // ไม่ตั้ง pool options ปล่อยให้ mssql ใช้ default
};

let cachedPool;

export async function getConnection() {
  if (cachedPool && cachedPool.connected) {
    return cachedPool; // reuse connection เดิมถ้ายังเชื่อมต่ออยู่
  }

  try {
    cachedPool = await sql.connect(config);
    console.log('Database connected');
    return cachedPool;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

export { getConnection, sql };