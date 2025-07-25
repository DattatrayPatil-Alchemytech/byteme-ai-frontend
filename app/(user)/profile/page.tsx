"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { mockVehicles } from "./mockVehicles";
import { Button } from "@/components/ui/button";
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
    setVehicles(
      vehicles.map((v) => (v.id === id ? { ...v, name: editName } : v))
    );
    setEditId(null);
    setEditError("");
  };
  const handleRemove = (id: number) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
  };

  // DataTable columns
  const columns: ColumnDef<(typeof vehicles)[number]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => {
        const vehicle = info.row.original;
        return editId === vehicle.id ? (
          <>
            <input
              className="border rounded px-2 py-1 text-sm"
              value={editName}
              onChange={(e) => {
                setEditName(e.target.value);
                if (editError) setEditError("");
              }}
              onBlur={() => handleSave(vehicle.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave(vehicle.id);
              }}
              autoFocus
            />
            {editError && (
              <div className="text-xs text-red-500 mt-1">{editError}</div>
            )}
          </>
        ) : (
          <span
            onClick={() => handleEdit(vehicle.id, vehicle.name)}
            className="cursor-pointer hover:underline text-foreground"
          >
            {vehicle.name}
          </span>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: (info) => (
        <span className="capitalize text-muted-foreground">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "reg",
      header: "Registration",
      cell: (info) => {
        const value = info.getValue() as string | undefined;
        return value ? (
          <span className="font-mono text-success">{value}</span>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        );
      },
    },
    {
      accessorKey: "numberPlate",
      header: "Number Plate",
      cell: (info) => {
        const value = info.getValue() as string | undefined;
        return value ? (
          <span className="font-mono text-success">{value}</span>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        );
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
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto min-w-0"
                onClick={() => handleEdit(vehicle.id, vehicle.name)}
              >
                Edit
              </Button>
            )}
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto min-w-0 text-destructive"
              onClick={() => handleRemove(vehicle.id)}
            >
              Remove
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-10 mt-10">
      {/* Header with Bell Icon removed */}
      {/* Profile Card */}
      <section className="flex flex-col items-center bg-white/90 rounded-2xl shadow-lg p-10 mb-2 transition-transform transition-shadow duration-300 hover:scale-[1.015] hover:shadow-2xl">
        <img
          src={userProfile.avatar}
          alt="avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow mb-4"
        />
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground mb-1">
            {userProfile.name}
          </div>
          <div className="text-base text-muted-foreground mb-2">
            {userProfile.email}
          </div>
          <div className="inline-block px-5 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm shadow-sm mt-2">
            {userProfile.tier} Tier
          </div>
        </div>
      </section>

      {/* Badges/NFTs display */}
      <section className="bg-white/90 rounded-2xl shadow-lg p-8 transition-transform transition-shadow duration-300 hover:scale-[1.015] hover:shadow-2xl">
        <div className="font-bold text-xl text-foreground mb-6 text-left">
          Badges
        </div>
        <div className="flex gap-8 justify-center">
          {userProfile.badges.map((badge) => (
            <div key={badge.id} className="flex flex-col items-center">
              <img
                src={badge.image}
                alt={badge.name}
                className="w-16 h-16 rounded-full border-2 border-primary mb-2 shadow animate-float-slow"
              />
              <span className="text-xs text-center text-muted-foreground font-medium">
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Notifications panel removed */}

      {/* List of registered vehicles with details */}
      <section className="bg-white/90 rounded-2xl shadow-lg p-8 mb-12 transition-transform duration-300 hover:scale-[1.015] hover:shadow-2xl">
        <div className="font-bold text-xl text-foreground mb-6 text-left">
          Registered Vehicles
        </div>
        <DataTable columns={columns} data={vehicles} />
      </section>
    </div>
  );
}
