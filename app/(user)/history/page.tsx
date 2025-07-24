"use client"
import React, { useState } from "react";

// Mock data for demonstration
const mockHistory = [
  {
    id: 1,
    user: "Alice",
    submissionCount: 12,
    milesDriven: 3200,
    carbonImpact: 0.8,
    rewards: 150,
    imageHash: "0xabc123",
    date: "2024-07-01",
  },
  {
    id: 2,
    user: "Bob",
    submissionCount: 8,
    milesDriven: 2100,
    carbonImpact: 0.5,
    rewards: 90,
    imageHash: "0xdef456",
    date: "2024-07-02",
  },
  {
    id: 3,
    user: "Charlie",
    submissionCount: 15,
    milesDriven: 4100,
    carbonImpact: 1.1,
    rewards: 200,
    imageHash: "0xghi789",
    date: "2024-07-03",
  },
];

const columns = [
  { key: "user", label: "User" },
  { key: "submissionCount", label: "Submission Count" },
  { key: "milesDriven", label: "Miles Driven" },
  { key: "carbonImpact", label: "Carbon Impact (tCO₂)" },
  { key: "rewards", label: "Rewards (B3TR)" },
  { key: "imageHash", label: "Image Hash" },
  { key: "date", label: "Date" },
];

const UserHistoryPage = () => {
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(true);

  // Filter logic (simple search by user)
  const filtered = mockHistory.filter((row) =>
    row.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User History</h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-64"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={() => setActiveOnly((v) => !v)}
          />
          Active Only
        </label>
      </div>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-2 text-left font-semibold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{row.user}</td>
                <td className="px-4 py-2">{row.submissionCount}</td>
                <td className="px-4 py-2">{row.milesDriven}</td>
                <td className="px-4 py-2">{row.carbonImpact}</td>
                <td className="px-4 py-2">{row.rewards}</td>
                <td className="px-4 py-2 font-mono text-xs">{row.imageHash}</td>
                <td className="px-4 py-2">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default UserHistoryPage; 