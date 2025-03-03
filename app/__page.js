"use client"; // ใช้ client component
// components/IProgressReport.js
import { useState, useEffect } from "react";

export default function IProgressReport() {
    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = () => {
        fetch("/api/iprogress")
          .then((res) => res.json())
          .then((result) => {
            const processedData = result.map((row) => ({
              ...row,
              percentage: ((row.iTScan / row.iTtote) * 100).toFixed(2),
            }));
            setData(processedData);
          })
          .catch((error) => console.error("Error fetching data:", error));
      };
  
      fetchData(); // ดึงข้อมูลครั้งแรก
      const interval = setInterval(fetchData, 5000); // ดึงข้อมูลทุก 5 วินาที
  
      return () => clearInterval(interval); // เคลียร์ interval เมื่อ component ถูก unmount
    }, []);
  
  

  return (
    <div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th >Route</th>
            <th >Store</th>
            <th >Tote</th>
            <th >Scan</th>
            <th >Order</th>
            <th >Scan</th>
            <th >Start</th>
            <th >Finish</th>
            <th >Time Diff</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="text-center">
              <td >{row.iRoute}</td>
              <td >{row.iStore}</td>
              <td >{row.iTtote}</td>
              <td >{row.iTScan}</td>
              <td >{row.iOrder}</td>
              <td
                className={`font-bold ${
                  row.percentage < 50
                    ? "text-red-600" // 🔴 น้อยกว่า 50% = แดง
                    : row.percentage < 100
                    ? "text-yellow-500" // 🟡 50-79% = เหลือง
                    : "text-green-600" // 🟢 100% = เขียว
                }`}
              >
                {row.percentage}%
              </td>
              <td >{row.iStart}</td>
              <td >{row.iFinish}</td>
              <td >{row.iTDiff}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
