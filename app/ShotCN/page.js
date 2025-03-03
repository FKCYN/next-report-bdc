"use client"; // ใช้ client component

import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = date ? `/api/notship?iDate=${date}` : "/api/notship";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch data");
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  return (
    <div className="min-h-screen bg-gray-100 p-5 font-sans">
      {/* Date Picker Section */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <label htmlFor="date" className="text-base font-medium text-gray-700">
          เลือกวันที่ :
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 text-base border border-gray-300 rounded-md outline-none cursor-pointer focus:border-blue-500 transition-colors"
        />
        <button
          onClick={fetchData}
          className="px-5 py-2 bg-blue-500 text-white border-none rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center p-5 text-blue-500 text-lg">
          <p>กำลังโหลด...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center p-5 text-red-500 text-lg bg-red-50 rounded-md">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          {data.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Tote</th>
                  <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Customer</th>
                  <th className="p-3 text-left font-semibold border-b-2 border-gray-200">CV Name</th>
                  <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Checker</th>
                  <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Route</th>
                  <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Product</th>
                  <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Product Name</th>
                  <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Qty</th>
                  <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Scan</th>
                  <th className="p-3 text-left font-semibold border-b-2 border-gray-200">CN</th>
                  <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Time</th>
                  <th className="p-3 text-left font-semibold border-b-2 border-gray-200">Cause</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition-colors">
                    <td className="p-3 border-b border-gray-200">{item.Tote}</td>
                    <td className="p-3 border-b border-gray-200">{item.CustomerID}</td>
                    <td className="p-3 border-b border-gray-200">{item.CVname}</td>
                    <td className="p-3 border-b border-gray-200">{item.iChecker}</td>
                    <td className="p-3 border-b border-gray-200">{item.route}</td>
                    <td className="p-3 border-b border-gray-200">{item.ProductID}</td>
                    <td className="p-3 border-b border-gray-200">{item.ProductDesc}</td>
                    <td className="p-3 border-b border-gray-200">{item.Qty}</td>
                    <td className="p-3 border-b border-gray-200">{item.iScan}</td>
                    <td className="p-3 border-b border-gray-200">{item.CNQty}</td>
                    <td className="p-3 border-b border-gray-200">{item.cnTime}</td>
                    <td className="p-3 border-b border-gray-200">{item.Cause}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center p-5 text-gray-500 text-base">No data available for this date.</p>
          )}
        </div>
      )}
    </div>
  );
}