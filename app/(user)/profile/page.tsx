"use client";
import React, { useState } from "react";
import Image from 'next/image';
import { DataTable, Column } from "@/components/ui/DataTable";
import { mockVehicles } from "./mockVehicles";
import { Button } from "@/components/ui/button";
import { Bell } from 'lucide-react';
import { useRouter } from "next/navigation";

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
  const [editError, setEditError] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  const handleEdit = (id: number, name: string) => {
    setEditId(id);
    setEditName(name);
    setEditError("");
  };
  const handleSave = (id: number) => {
    if (!editName.trim()) {
      setEditError("Name cannot be empty");
      return;
    }
    setVehicles(vehicles.map(v => v.id === id ? { ...v, name: editName } : v));
    setEditId(null);
    setEditError("");
  };
  const handleRemove = (id: number) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  // DataTable columns
  const columns: Column[] = [
    {
      key: "name",
      label: "Name",
      render: (value, row) => {
        const vehicle = row as { id: number; name: string };
        return editId === vehicle.id ? (
          <>
            <input
              className="border rounded px-2 py-1 text-sm"
              value={editName}
              onChange={e => { setEditName(e.target.value); if (editError) setEditError(""); }}
              onBlur={() => handleSave(vehicle.id)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(vehicle.id); }}
              autoFocus
            />
            {editError && (
              <div className="text-xs text-red-500 mt-1">{editError}</div>
            )}
          </>
        ) : (
          <span onClick={() => handleEdit(vehicle.id, vehicle.name)} className="cursor-pointer hover:underline text-foreground">
            {vehicle.name}
          </span>
        );
      },
    },
    {
      key: "type",
      label: "Type",
      render: (value) => <span className="capitalize text-muted-foreground">{value as string}</span>,
    },
    {
      key: "reg",
      label: "Registration",
      render: (value) => {
        const stringValue = value as string | undefined;
        return stringValue ? <span className="font-mono text-success">{stringValue}</span> : <span className="text-muted-foreground">N/A</span>;
      },
    },
    {
      key: "numberPlate",
      label: "Number Plate",
      render: (value) => {
        const stringValue = value as string | undefined;
        return stringValue ? <span className="font-mono text-success">{stringValue}</span> : <span className="text-muted-foreground">N/A</span>;
      },
    },
    {
      key: "edit",
      label: "",
      render: (value, row) => {
        const vehicle = row as { id: number; name: string };
        return (
          <div className="flex gap-2">
            {editId !== vehicle.id && (
              <Button variant="link" size="sm" className="p-0 h-auto min-w-0" onClick={() => handleEdit(vehicle.id, vehicle.name)}>
                Edit
              </Button>
            )}
            <Button variant="link" size="sm" className="p-0 h-auto min-w-0 text-destructive" onClick={() => handleRemove(vehicle.id)}>
              Remove
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-4 mt-10 mb-10">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-2 px-4 py-2 bg-muted text-foreground border border-border rounded-lg hover:bg-primary/10 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </button>
      {/* Header with Bell Icon removed */}
      {/* Profile Card */}
      <section className="flex flex-col items-center bg-background border border-border rounded-2xl p-10">
        <Image src={userProfile.avatar} alt="avatar" width={112} height={112} className="w-28 h-28 rounded-full object-cover border-4 border-primary mb-4" />
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground mb-1">{userProfile.name}</div>
          <div className="text-base text-muted-foreground mb-2">{userProfile.email}</div>
          <div className="inline-block px-5 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm mt-2">{userProfile.tier} Tier</div>
        </div>
      </section>

      {/* Badges/NFTs display */}
      <section className="bg-background border border-border rounded-2xl p-8">
        <div className="font-bold text-xl text-foreground mb-6 text-left">Badges / NFTs</div>
        <div className="flex gap-8 justify-center">
          {userProfile.badges.map(badge => (
            <div key={badge.id} className="flex flex-col items-center">
              <Image src={badge.image} alt={badge.name} width={64} height={64} className="w-16 h-16 rounded-full border-2 border-primary mb-2" />
              <span className="text-xs text-center text-muted-foreground font-medium">{badge.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Notifications panel removed */}

      {/* List of registered vehicles with details */}
      <section className="bg-background border border-border rounded-2xl p-8">
        <div className="font-bold text-xl text-foreground mb-6 text-left">Registered Vehicles</div>
        <DataTable columns={columns} data={vehicles} />
      </section>
    </div>
  );
} 