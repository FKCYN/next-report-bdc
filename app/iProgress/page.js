"use client";
import { useState, useEffect, useCallback, useRef } from "react";

export default function IProgressReport() {
  const [data, setData] = useState([]);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/iprogress");
      if (!res.ok) throw new Error("Failed to fetch data");
      const result = await res.json();
      setData((prevData) => {
        if (JSON.stringify(prevData) !== JSON.stringify(result)) {
          return result;
        }
        return prevData;
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 5000);
    return () => clearInterval(intervalRef.current);
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gray-100 p-5 font-sans">
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        {/* หัวตาราง */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Route</th>
              <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Store</th>
              <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Tote</th>
              <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Scan</th>
              <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Order</th>
              <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Start</th>
              <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Finish</th>
              <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Time Diff</th>
              <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Scan %</th>
            </tr>
          </thead>
          {/* เนื้อหาตาราง */}
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-5 text-center text-gray-500 text-base">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-100 transition-colors">
                  <td className="p-3 border-b border-gray-200">{row.iRoute}</td>
                  <td className="p-3 border-b border-gray-200">{row.iStore}</td>
                  <td className="p-3 border-b border-gray-200">{row.iTtote}</td>
                  <td className="p-3 border-b border-gray-200">{row.iTScan}</td>
                  <td className="p-3 border-b border-gray-200">{row.iOrder}</td>
                  <td className="p-3 border-b border-gray-200">{row.iStart}</td>
                  <td className="p-3 border-b border-gray-200">{row.iFinish}</td>
                  <td className="p-3 border-b border-gray-200">{row.iTDiff}</td>
                  <td className="p-3 border-b border-gray-200 font-bold  text-center">
                    <span
                      className={`${
                        row.percentage < 50
                          ? "text-red-600"
                          : row.percentage < 100
                          ? "text-yellow-500"
                          : "text-green-600"
                      }`}
                    >
                      {row.percentage}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}