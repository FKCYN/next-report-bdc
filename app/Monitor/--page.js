// app/Monitor/page.js
"use client"; // ระบุว่าเป็น client component
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalQty, setTotalQty] = useState(0);
  const [totalScan, setTotalScan] = useState(0);
  const [totalQtyTote, setTotalQtyTote] = useState(0);
  const intervalRef = useRef();

  const fetchData = async () => {
    try {
      const response = await fetch("/api/iprogress"); // ดึงข้อมูลจาก API
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      setData(result);
      setTotalQty(result.reduce((sum, item) => sum + (item.iOrder || 0), 0)); // ใช้ iOrder
      setTotalScan(result.reduce((sum, item) => sum + (item.iScan || 0), 0)); // ใช้ iScan
      setTotalQtyTote(
        result.reduce((sum, item) => sum + (item.iTtote || 0), 0)
      ); // ใช้ iTtote
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 5000); // รีเฟรชทุก 5 วินาที
    return () => clearInterval(intervalRef.current); // คลีนอัพเมื่อ component unmount
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-2xl">
        Error: {error}
      </div>
    );
  }

  const percent = totalQty > 0 ? ((totalScan / totalQty) * 100).toFixed(2) : 0;
  const zpercent = totalQty > 0 ? (100 - percent).toFixed(2) : 0;

  return (
    <div className="container-fluid p-4 bg-gray-100 min-h-screen">
      <div className="row">
        <div className="col-md-12">
          <div className="panel panel-danger">
            {/* Header Row */}
            <div className="bg-gray-700 text-white p-2 flex justify-center items-center align-item-center">
              <div className="flex items-center space-x-4">
                <div>
                <h2 className="text-2xl font-bold text-center p-4">
                  MONITOR ประจำวันที่:{" "}
                  {new Date("2025-03-02").toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </h2>
                  MONITOR BDC  
                  <button className="btn btn-sm btn-light w-4 h-4"> </button> 0%
                   <button className="btn btn-sm btn-danger w-4 h-4"> </button>{" "}
                  ไม่ครบ 100%  
                  <button className="btn btn-sm btn-success w-4 h-4"> </button>{" "}
                  100%  
                  <button className="btn btn-sm btn-warning w-4 h-4"> </button>{" "}
                  ขาด  
                  <button className="btn btn-sm btn-primary w-4 h-4"> </button>{" "}
                  CN
                </div>
              </div>
              <div className="text-right p-4">
                <button className="btn btn-primary btn-lg p-4">
                  {" "}
                  <p>complete</p>{" "}
                  <p className="text-1xl font-bold">{percent}</p> %{" "}
                  <p>{totalScan.toLocaleString()} Ship</p>{" "}
                </button>{" "}
                <button className="btn btn-danger btn-lg p-4">
                  {" "}
                  <p>waiting</p>{" "}
                  <p className="text-1xl font-bold">{zpercent}</p> %{" "}
                  <p>{(totalQty - totalScan).toLocaleString()} Ship</p>{" "}
                </button>
                <p className="text-2xl font-bold">
                  WORKLOAD: {totalQty.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Grid for Routes */}
            <div className="panel-body bg-gray-200 p-4 grid grid-cols-6 gap-2">
              {data.map((item, index) => {
                const xpercent =
                  item.iOrder > 0
                    ? ((item.iScan / item.iOrder) * 100).toFixed(1)
                    : 0;
                let btnColor = "btn-light";
                if (item.iScan === 0) btnColor = "btn-light";
                else if (item.iOrder === item.iScan) btnColor = "btn-success";
                else if (item.CN > 0)
                  btnColor = "btn-warning"; // ใช้ CN แทน QtyTote_notship
                else if (item.iScan < item.iOrder) btnColor = "btn-danger";

                return (
                  <button
                    key={index}
                    className={`btn btn-md ${btnColor} p-2 text-center w-full`}
                    onClick={() =>
                      (window.location.href = `/show-route?route=${
                        item.iRoute
                      }&date=${new Date().toISOString().split("T")[0]}`)
                    }
                  >
                    <span className="font-bold text-lg">{item.iRoute}</span>
                    <br />
                    {xpercent} %
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
