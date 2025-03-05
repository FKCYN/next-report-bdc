"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 text-white p-4 shadow-md z-10"
      style={{ backgroundColor: "#F37199" }}
    >
      <div className="flex items-center space-x-4 justify-center">
        <h1 className="text-xl font-bold">Report -</h1>
        <Link
          href="/iProgress"
          className="px-3 py-1 text-white  rounded-md hover:bg-blue-800 transition-colors"
          style={{ backgroundColor: "#AC1754" }}
        >
          iProgress
        </Link>
        <Link
          href="/ShotCN"
          className="px-3 py-1 text-white  rounded-md hover:bg-blue-800 transition-colors"
          style={{ backgroundColor: "#AC1754" }}
        >
          ShotCN
        </Link>
        <Link
          href="/Monitor"
          className="px-3 py-1 text-white  rounded-md hover:bg-blue-800 transition-colors"
          style={{ backgroundColor: "#AC1754" }}
        >
          Monitor
        </Link>
      </div>
    </nav>
  );
}
