"use client"; // ใช้ client component

import { useState, useEffect } from "react";

export default function Home() {
  const [routes, setRoutes] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [totalQty, setTotalQty] = useState(0);
  const [totalScan, setTotalScan] = useState(0);

  // ดึงข้อมูลจาก API
  const fetchRoutes = async (selectedDate) => {
    const res = await fetch(`/api/routes?date=${selectedDate}`);
    const data = await res.json();
    setRoutes(data);

    const totalShip = data.reduce(
      (sum, route) => sum + (route.QtyShip || 0),
      0
    );
    const totalScanned = data.reduce(
      (sum, route) => sum + (route.OrderShip || 0),
      0
    );
    setTotalQty(totalShip);
    setTotalScan(totalScanned);
  };

  useEffect(() => {
    fetchRoutes(date);
  }, [date]);

  // WebSocket สำหรับอัพเดทเรียลไทม์
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      fetchRoutes(date); // อัพเดทข้อมูลเมื่อได้รับข้อความจาก WebSocket
    };
    return () => ws.close();
  }, [date]);

  // คำนวณเปอร์เซ็นต์
  const percentComplete =
    totalScan && totalQty ? ((totalScan / totalQty) * 100).toFixed(2) : 0;
  const percentWaiting = totalQty ? (100 - percentComplete).toFixed(2) : 0;

  // กำหนดสีตามสถานะ
  const getButtonColor = (route) => {
    const scanQty = route.OrderShip || 0;
    const qty = route.QtyShip || 0;
    const xpercent = qty ? ((scanQty / qty) * 100).toFixed(1) : 0;

    if (scanQty === 0) return "btn-light";
    if (qty === scanQty) return "btn-success";
    if (route.QtyTote_notship > 0) return "btn-warning";
    if (route.QtyTote_CN > 0) return "btn-primary";
    if (scanQty < qty) return "btn-danger";
    return "btn-primary"; // สำหรับ iStatus 'ตัดร้าน' หรืออื่นๆ
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-9">
          <div className="panel panel-danger">
            <h2
              style={{
                textAlign: "center",
                marginTop: "10px",
                backgroundColor: "#546e7a",
                color: "#fff",
              }}
            >
              MONITOR ประจำวันที่: {date}
            </h2>
            <div
              className="panel-heading"
              style={{
                backgroundColor: "#546e7a",
                color: "#fff",
                fontSize: "15px",
              }}
            >
              MONITOR Chiang Mai BDC{" "}
              <button
                className="btn btn-sm btn-light"
                style={{ height: "3px", width: "3px" }}
              ></button>{" "}
              0%{" "}
              <button
                className="btn btn-sm btn-danger"
                style={{ height: "3px", width: "3px" }}
              ></button>{" "}
              ไม่ครบ 100%{" "}
              <button
                className="btn btn-sm btn-success"
                style={{ height: "3px", width: "3px" }}
              ></button>{" "}
              100%{" "}
              <button
                className="btn btn-sm btn-warning"
                style={{ height: "3px", width: "3px" }}
              ></button>{" "}
              ขาด{" "}
              <button
                className="btn btn-sm btn-primary"
                style={{ height: "3px", width: "3px" }}
              ></button>{" "}
              CN
            </div>
            <div className="panel-body" style={{ backgroundColor: "#eceff1" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "10px",
                  padding: "10px",
                }}
              >
                {routes.map((route, index) => {
                  const xpercent = route.QtyShip
                    ? ((route.OrderShip / route.QtyShip) * 100).toFixed(1)
                    : 0;
                  return (
                    <button
                      key={index}
                      className={`btn btn-md ${getButtonColor(route)}`}
                      style={{ padding: "1rem" }}
                      onClick={() => alert(`Detail for Route ${route.RouteNo}`)} // ตัวอย่างการคลิก
                    >
                      <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                        {route.RouteNo}
                      </span>
                      <br />
                      {xpercent} %
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <form
            className="form-inline"
            onSubmit={(e) => {
              e.preventDefault();
              fetchRoutes(date);
            }}
          >
            <font color="#000">
              <b>DATE : &nbsp;</b>
            </font>
            <input
              type="date"
              id="idate"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-control"
            />
          </form>
          <div className="panel panel-danger">
            <div className="panel-body" style={{ backgroundColor: "#eceff1" }}>
              <div
                className="col-xs-6 text-center"
                style={{ marginTop: "1px" }}
              >
                <font size="+2">
                  <b>WORKLOAD : {totalQty.toLocaleString()}</b>
                </font>
                <br />
                <button className="btn btn-primary btn-lg">
                  complete
                  <br />
                  <b style={{ fontSize: "2.5em" }}>{percentComplete}</b> %<br />{" "}
                  {totalScan.toLocaleString()} Ship
                </button>
                <button className="btn btn-danger btn-lg">
                  waiting
                  <br />
                  <b style={{ fontSize: "2.5em" }}>{percentWaiting}</b> %<br />{" "}
                  {(totalQty - totalScan).toLocaleString()} Ship
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
