import React from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";

// ฟังก์ชันคำนวณผลต่างเวลาจาก HH:MM:SS
const calculateTimeDiff = (start, finish) => {
  if (!start || !finish) return "-";

  const [startHours, startMinutes, startSeconds] = start.split(":").map(Number);
  const [finishHours, finishMinutes, finishSeconds] = finish
    .split(":")
    .map(Number);

  const startTotalSeconds =
    startHours * 3600 + startMinutes * 60 + startSeconds;
  const finishTotalSeconds =
    finishHours * 3600 + finishMinutes * 60 + finishSeconds;
  let diffSeconds = finishTotalSeconds - startTotalSeconds;

  if (diffSeconds < 0) diffSeconds += 24 * 3600;

  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

const OrderScanStats = ({
  iScan,
  iOrder,
  sumCN,
  iStart,
  iFinish,
  sumiStore,
  sumiTtote,
}) => {
  const overallPercentage =
    iOrder > sumCN ? ((iScan / (iOrder - sumCN)) * 100).toFixed(0) : 0;

  const timeDiff = calculateTimeDiff(iStart, iFinish);
  const orderDiff = iOrder - iScan;

  return (
    <div>
      {/* แถวบน: Overall Progress, Total Scan, Total Order, Order Diff, CN */}
      <Row gutter={[24, 16]} className="justify-center text-center font-bold">
        <Col span={4}>
          <Card variant="borderless">
            <Statistic
              title="Progress"
              value={overallPercentage}
              precision={0}
              valueStyle={{ color: "#E53888" }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless">
            <Statistic
              title="Total Scan"
              value={iScan}
              precision={0}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: "#AC1754" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless">
            <Statistic
              title="Total Order"
              value={iOrder}
              precision={0}
              valueStyle={{ color: "#E53888" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless">
            <Statistic
              title="Order Diff"
              value={orderDiff}
              precision={0}
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: "#AC1754" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless">
            <Statistic
              title="CN"
              value={sumCN}
              precision={0}
              valueStyle={{ color: "#E53888" }}
            />
          </Card>
        </Col>
      </Row>

      {/* แถวล่าง: Start Time, Finish Time, Overall Time Diff, Total Stores, Total Totes */}
      <Row
        gutter={[24, 16]}
        className="justify-center text-center font-bold mt-4"
      >
        <Col span={4}>
          <Card variant="borderless">
            <Statistic
              title="Start Time"
              value={iStart || "-"}
              valueStyle={{ color: "#AC1754" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless">
            <Statistic
              title="Finish Time"
              value={iFinish || "-"}
              valueStyle={{ color: "#E53888" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless">
            <Statistic
              title="Time Diff"
              value={timeDiff}
              valueStyle={{ color: "#AC1754" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless">
            <Statistic
              title="Total Stores"
              value={sumiStore}
              precision={0}
              valueStyle={{ color: "#E53888" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless">
            <Statistic
              title="Total Totes"
              value={sumiTtote}
              precision={0}
              valueStyle={{ color: "#AC1754" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScanStats;
