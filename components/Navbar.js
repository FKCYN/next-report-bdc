"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-blue-600 text-white p-4 shadow-md z-10">
      <div className="flex items-center space-x-4 justify-center">
        <h1 className="text-xl font-bold">Report -</h1>
        <Link
          href="/iProgress"
          className="px-3 py-1 text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors"
        >
          iProgress
        </Link>
        <Link
          href="/ShotCN"
          className="px-3 py-1 text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors"
        >
          ShotCN
        </Link>
        <Link
          href="/Monitor"
          className="px-3 py-1 text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors"
        >
          Monitor
        </Link>
      </div>
    </nav>
  );
}
