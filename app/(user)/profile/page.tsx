"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { mockVehicles } from "./mockVehicles";

// Mock data for profile, badges, tier, notifications, and vehicles
const userProfile = {
  name: "Jane Doe",
  email: "jane.doe@email.com",
  avatar: "/assets/bike-ev.jpg",
  tier: "Gold",
  badges: [
    { id: 1, name: "Eco Warrior", image: "/assets/bike-ev.jpg" },
    { id: 2, name: "EV Pioneer", image: "/assets/car-ev.jpg" },
  ],
  notifications: [
    { id: 1, message: "Your vehicle registration is approved!", read: false },
    { id: 2, message: "New badge earned: Eco Warrior!", read: true },
  ],
};

export default function UserProfilePage() {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const handleEdit = (id: number, name: string) => {
    setEditId(id);
    setEditName(name);
  };
  const handleSave = (id: number) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, name: editName } : v));
    setEditId(null);
  };
  const handleRemove = (id: number) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  // DataTable columns
  const columns: ColumnDef<(typeof vehicles)[number]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => {
        const vehicle = info.row.original;
        return editId === vehicle.id ? (
          <input
            className="border rounded px-2 py-1 text-sm"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onBlur={() => handleSave(vehicle.id)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(vehicle.id); }}
            autoFocus
          />
        ) : (
          <span onClick={() => handleEdit(vehicle.id, vehicle.name)} className="cursor-pointer hover:underline">
            {vehicle.name}
          </span>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: (info) => <span className="capitalize">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "reg",
      header: "Registration",
      cell: (info) => <span className="font-mono">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "numberPlate",
      header: "Number Plate",
      cell: (info) => {
        const value = info.getValue() as string | undefined;
        return value ? <span className="font-mono">{value}</span> : <span className="text-gray-400">N/A</span>;
      },
    },
    {
      id: "edit",
      header: "",
      cell: (info) => {
        const vehicle = info.row.original;
        return (
          <div className="flex gap-2">
            {editId !== vehicle.id && (
              <button className="text-xs text-primary underline" onClick={() => handleEdit(vehicle.id, vehicle.name)}>
                Edit
              </button>
            )}
            <button className="text-xs text-red-500 underline" onClick={() => handleRemove(vehicle.id)}>
              Remove
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 mt-2">
      {/* Profile Section */}
      <section className="flex items-center gap-4 p-4 bg-white rounded shadow">
        <img src={userProfile.avatar} alt="avatar" className="w-16 h-16 rounded-full object-cover border" />
        <div>
          <div className="font-bold text-lg">{userProfile.name}</div>
          <div className="text-sm text-gray-500">{userProfile.email}</div>
        </div>
        <div className="ml-auto px-4 py-1 rounded bg-primary text-primary-foreground font-semibold text-xs">{userProfile.tier} Tier</div>
      </section>

      {/* Badges/NFTs display */}
      <section className="bg-white rounded shadow p-4">
        <div className="font-semibold mb-2">Badges / NFTs</div>
        <div className="flex gap-4">
          {userProfile.badges.map(badge => (
            <div key={badge.id} className="flex flex-col items-center">
              <img src={badge.image} alt={badge.name} className="w-12 h-12 rounded-full border mb-1" />
              <span className="text-xs text-center">{badge.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Notifications panel */}
      <section className="bg-white rounded shadow p-4">
        <div className="font-semibold mb-2">Notifications</div>
        <ul className="space-y-1">
          {userProfile.notifications.map(note => (
            <li key={note.id} className={note.read ? "text-gray-400" : "font-medium text-gray-800"}>
              {note.message}
            </li>
          ))}
        </ul>
      </section>

      {/* List of registered vehicles with details */}
      <section className="bg-white rounded shadow p-4">
        <div className="font-semibold mb-2">Registered Vehicles</div>
        <DataTable columns={columns} data={vehicles} />
      </section>
    </div>
  );
} 