"use client";
import React, { useState, useEffect } from "react";
import { User, Award, Star } from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { mockVehicles } from "./mockVehicles";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSelector } from "react-redux";
import { apiGet } from "@/lib/apiHelpers/apiMiddleware";
import { getRequest } from "@/lib/api/apiRequests";

// Mock data for profile, badges, tier, notifications, and vehicles
const userProfile = {
  name: "Jane Doe",
  email: "jane.doe@email.com",
  avatar: "icon", // Use icon for avatar
  tier: "Gold",
  badges: [
    { id: 1, name: "Eco Warrior", icon: Award },
    { id: 2, name: "EV Pioneer", icon: Star },
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
  const [fakeData, setFakeData] = useState<any>(null); // New state for fake API data
  const router = useRouter();

  // Get user data from redux
  const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    // Fake API call to /posts/1 using getRequest
    getRequest("/posts/1")
      .then((response) => setFakeData(response.data || response))
      .catch((err) => setFakeData({ error: err.message }));
  }, []);

  console.log(fakeData)

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
      key: "type",
      label: "Type",
      render: (value) => (
        <span className="capitalize text-muted-foreground">
          {value as string}
        </span>
      ),
    },
    {
      key: "reg",
      label: "Registration",
      render: (value) => {
        const stringValue = value as string | undefined;
        return stringValue ? (
          <span className="font-mono text-success">{stringValue}</span>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        );
      },
    },
    {
      key: "numberPlate",
      label: "Number Plate",
      render: (value) => {
        const stringValue = value as string | undefined;
        return stringValue ? (
          <span className="font-mono text-success">{stringValue}</span>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        );
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
    <div className="max-w-3xl mx-auto space-y-4 mt-10 mb-10">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 ml-1 flex items-center justify-center w-9 h-9 rounded-full border border-border bg-muted text-foreground hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors shadow-sm"
        aria-label="Go back"
        title="Go back"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      {/* Profile Card */}
      <section className="flex flex-col items-center bg-background rounded-2xl border border-gray-300 p-10 mb-4">
        <div className="w-28 h-28 rounded-full border-4 border-primary mb-4 flex items-center justify-center bg-muted">
          <User className="w-20 h-20 text-primary" />
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground mb-1">
            {user?.name || "Jane Doe"}
          </div>
          <div className="text-base text-muted-foreground mb-2">
            {user?.email || "jane.doe@email.com"}
          </div>
          {/* <div className="inline-block px-5 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm mt-2">
            {user?.role === "admin" ? "Admin" : user?.role === "user" ? "Gold" : "Gold"} Tier
          </div> */}
        </div>
      </section>

      {/* Badges/NFTs display */}
      <section className="bg-card/90 rounded-2xl border border-gray-300 p-8 mb-4">
        <div className="font-bold text-xl text-foreground mb-6 text-left">
          Badges
        </div>
        <div className="flex gap-8 justify-center">
          {userProfile.badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.id} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-primary mb-2 flex items-center justify-center bg-muted">
                  <Icon className="w-10 h-10 text-primary" />
                </div>
                <span className="text-xs text-center text-muted-foreground font-medium">
                  {badge.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Notifications panel removed */}

      {/* List of registered vehicles with details */}
      <section className="bg-card/90 rounded-2xl border border-gray-300 p-8 mb-4">
        <div className="font-bold text-xl text-foreground mb-6 text-left">
          Registered Vehicles
        </div>
        <DataTable columns={columns} data={vehicles} />
      </section>
    </div>
  );
}
