// server.js
const WebSocket = require('ws');
const sql = require('mssql');
const dbConfig = {
  user: 'ibdccr',
  password: 'iloveyou',
  server: '192.168.81.150',
  database: 'BuSamrong',
  options: { encrypt: true, trustServerCertificate: true },
};

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', async (ws) => {
  console.log('Client connected');
  ws.send(JSON.stringify({ message: 'Connected to WebSocket' }));

  // อัพเดทข้อมูลทุก 5 วินาทีจาก SQL Server
  setInterval(async () => {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('iDate', sql.NVarChar, new Date().toISOString().split('T')[0])
      .execute('[dbo].[Show_Route]');
    ws.send(JSON.stringify(result.recordset));
    await pool.close();
  }, 5000);
});

console.log('WebSocket server running on ws://localhost:8080');