"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Progress, Select } from "antd";
import OrderScanStats from '@/components/OrderScanStats';

const { Option } = Select;

export default function IProgressReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPo, setSelectedPo] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = selectedPo ? `/api/iprogress?po=${selectedPo}` : "/api/iprogress";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch data");
      const result = await res.json();
      setData(result);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedPo]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 5000);
    return () => clearInterval(intervalRef.current);
  }, [fetchData]);

  const handlePoChange = (value) => {
    setSelectedPo(value);
  };

  // คำนวณผลรวมและค่าเริ่ม/จบ
  const totalOrder = data.reduce((sum, row) => sum + (row.iOrder || 0), 0);
  const totalScan = data.reduce((sum, row) => sum + (row.iScan || 0), 0);
  const totalCN = data.reduce((sum, row) => sum + (row.CN || 0), 0);
  const totalStores = data.reduce((sum, row) => sum + (row.iStore || 0), 0);
  const totalTotes = data.reduce((sum, row) => sum + (row.iTtote || 0), 0);
  // หา iStart และ iFinish จาก data (สมมติว่าเป็น string HH:MM:SS)
  const iStart = data.length > 0 ? data.reduce((min, row) => (row.iStart < min ? row.iStart : min), data[0].iStart) : null;
  const iFinish = data.length > 0 ? data.reduce((max, row) => (row.iFinish > max ? row.iFinish : max), data[0].iFinish) : null;
  const timeDiff = iFinish - iStart;


  if (loading && data.length === 0) {
    return <div className="min-h-screen bg-gray-100 p-5">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-5 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5 font-sans">
      {/* เรียกใช้ OrderScanStats */}
      <div className="mb-5">
        <OrderScanStats
          iScan={totalScan}
          iOrder={totalOrder}
          sumCN={totalCN}
          iStart={iStart}
          iFinish={iFinish}
          sumiStore={totalStores}
          sumiTtote={totalTotes}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="p-3 text-center font-semibold border-b-2 border-gray-200">
                <Select
                  placeholder="Select Po"
                  onChange={handlePoChange}
                  value={selectedPo}
                  style={{ width: 120 }}
                  allowClear
                >
                  <Option value="Po1">Po1</Option>
                  <Option value="Po2">Po2</Option>
                </Select>
              </th>
              <th className="p-3 text-center font-semibold border-b-2 border-gray-200">Route</th>
              <th className="p-3 text-center font-semibold border-b-2 border-gray-200">Store</th>
              <th className="p-3 text-center font-semibold border-b-2 border-gray-200">Tote</th>
              <th className="p-3 text-center font-semibold border-b-2 border-gray-200">Scan</th>
              <th className="p-3 text-center font-semibold border-b-2 border-gray-200">Order</th>
              <th className="p-3 text-center font-semibold border-b-2 border-gray-200">iScan</th>
              <th className="p-3 text-center font-semibold border-b-2 border-gray-200">Start</th>
              <th className="p-3 text-center font-semibold border-b-2 border-gray-200">Finish</th>
              <th className="p-3 text-center font-semibold border-b-2 border-gray-200">Time Diff</th>
              <th className="p-3 text-center font-semibold border-b-2 border-gray-200">CN</th>
              <th className="p-3 text-center font-semibold border-b-2 border-gray-200">Scan %</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="12" className="p-5 text-center text-gray-500 text-base">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-100 transition-colors text-center">
                  <td className="p-3 border-b border-gray-200">{row.Po}</td>
                  <td className="p-3 border-b border-gray-200">{row.iRoute}</td>
                  <td className="p-3 border-b border-gray-200">{row.iStore}</td>
                  <td className="p-3 border-b border-gray-200">{row.iTtote}</td>
                  <td className="p-3 border-b border-gray-200">{row.iTScan}</td>
                  <td className="p-3 border-b border-gray-200">{row.iOrder}</td>
                  <td className="p-3 border-b border-gray-200">{row.iScan}</td>
                  <td className="p-3 border-b border-gray-200">{row.iStart}</td>
                  <td className="p-3 border-b border-gray-200">{row.iFinish}</td>
                  <td className="p-3 border-b border-gray-200">{row.iTDiff}</td>
                  <td className="p-3 border-b border-gray-200">{row.CN}</td>
                  <td className="p-3 border-b border-gray-200">
                    <Progress
                      percent={parseFloat(row.percentage)}
                      percentPosition={{ align: "center", type: "inner" }}
                      size={[150, 35]}
                      strokeColor={
                        row.percentage < 50
                          ? "#f56565"
                          : row.percentage < 100
                          ? "#ecc94b"
                          : "#48bb78"
                      }
                    />
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