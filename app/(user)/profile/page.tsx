"use client";
import React, { useState, useEffect } from "react";
import { User, Award, Star, Pencil } from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Modal from "@/components/modals/Modal";
import {
  getUserVehicles,
  VehicleData,
  addVehicle,
  deleteVehicle,
} from "@/lib/apiHelpers/profile";
import toast from "react-hot-toast";

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
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    model: "",
    vehicleType: "",
    plateNumber: "",
  });
  const [addError, setAddError] = useState("");
  const [addFieldErrors, setAddFieldErrors] = useState<{
    model?: string;
    vehicleType?: string;
    plateNumber?: string;
  }>({});
  const [addVehicleLoading, setAddVehicleLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const router = useRouter();

  // Get user data from redux
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    setVehiclesLoading(true);
    getUserVehicles()
      .then((data: VehicleData[]) => {
        console.log("data", data);
        // Map API data to DataTable expected format
        const mapped = data.map((vehicle) => ({
          id: vehicle.id,
          name: [vehicle.model]
            .filter((v) => v && v !== "null" && v !== "")
            .join(" "),
          type: vehicle.vehicleType,
          reg: vehicle.plateNumber,
          numberPlate: vehicle.plateNumber,
        }));
        setVehicles(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch vehicles", err);
        setVehicles([]);
      })
      .finally(() => {
        setVehiclesLoading(false);
      });
  }, []);

  console.log("vehicles", vehicles);

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
  const handleRemove = async (id: string) => {
    setDeleteLoadingId(id);
    try {
      await deleteVehicle(id);
      toast.success("Vehicle deleted successfully!");
      setVehiclesLoading(true);
      const data = await getUserVehicles();
      const mapped = data.map((vehicle: VehicleData) => ({
        id: vehicle.id,
        name: [vehicle.model]
          .filter((v) => v && v !== "null" && v !== "")
          .join(" "),
        type: vehicle.vehicleType,
        reg: vehicle.plateNumber,
        numberPlate: vehicle.plateNumber,
      }));
      setVehicles(mapped);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete vehicle");
    } finally {
      setDeleteLoadingId(null);
      setVehiclesLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    const errors: {
      model?: string;
      vehicleType?: string;
      plateNumber?: string;
    } = {};
    if (!newVehicle.model.trim()) errors.model = "Model is required";
    if (!newVehicle.vehicleType.trim()) errors.vehicleType = "Type is required";
    setAddFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setAddVehicleLoading(true);
    try {
      await addVehicle({
        model: newVehicle.model,
        vehicleType: newVehicle.vehicleType,
        plateNumber: newVehicle.plateNumber,
      });
      toast.success("Vehicle added successfully!");
      handleCloseAddDialog();
      setVehiclesLoading(true);
      const data = await getUserVehicles();
      const mapped = data.map((vehicle: VehicleData) => ({
        id: vehicle.id,
        name: [vehicle.model].filter(Boolean).join(" "),
        type: vehicle.vehicleType,
        reg: vehicle.plateNumber,
        numberPlate: vehicle.plateNumber,
      }));
      setVehicles(mapped);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add vehicle");
      setAddError(err?.message || "Failed to add vehicle");
    } finally {
      setAddVehicleLoading(false);
      setVehiclesLoading(false);
    }
  };

  // Helper to close dialog and reset form
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setNewVehicle({ model: "", vehicleType: "", plateNumber: "" });
    setAddError("");
    setAddFieldErrors({});
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
              className="border border-border rounded px-2 py-1 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
              <div className="text-xs text-destructive mt-1">{editError}</div>
            )}
          </>
        ) : (
          <span className="flex flex-row items-center gap-1">
            <span className="text-foreground leading-none">{vehicle.name}</span>
            <button
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary flex items-center justify-center"
              title="Edit name"
              onClick={() => handleEdit(vehicle.id, vehicle.name)}
              aria-label="Edit name"
            >
              <Pencil className="w-4 h-4 align-middle" />
            </button>
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
        const vehicle = row as { id: string | number; name: string };
        const idStr = String(vehicle.id);
        return (
          <div className="flex gap-2">
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto min-w-0 text-destructive"
              onClick={() => handleRemove(idStr)}
              disabled={deleteLoadingId === idStr}
            >
              {deleteLoadingId === idStr ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <style jsx>{`
        /* Custom dropdown styling for dark mode */
        select {
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          border-color: hsl(var(--border));
          border-width: 1px;
          border-style: solid;
        }

        select option {
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          padding: 8px 12px;
        }

        select option:hover {
          background-color: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }

        select:focus {
          outline: none;
          border-color: hsl(var(--ring));
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
        }

        /* Fix dropdown overflow issues */
        .relative {
          position: relative;
          z-index: 10;
        }

        /* Ensure dropdown options are visible */
        select {
          z-index: 20;
        }

        /* Ensure dropdown can expand beyond modal boundaries */
        select:focus {
          z-index: 50;
        }

        /* Custom dropdown container */
        .dropdown-container {
          position: relative;
          z-index: 30;
        }
      `}</style>

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
        <section className="flex flex-col items-center bg-card rounded-2xl border border-border p-10 mb-4 shadow-lg">
          <div className="w-28 h-28 rounded-full border-4 border-primary mb-4 flex items-center justify-center bg-muted">
            <User className="w-20 h-20 text-primary" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-1">
              {"Jane Doe"}
            </div>
            <div className="text-base text-muted-foreground mb-2">
              {user?.email}
            </div>
            {/* <div className="inline-block px-5 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm mt-2">
              {user?.role === "admin" ? "Admin" : user?.role === "user" ? "Gold" : "Gold"} Tier
            </div> */}
          </div>
        </section>

        {/* Badges/NFTs display */}
        <section className="bg-card rounded-2xl border border-border p-8 mb-4 shadow-lg">
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
        <section className="bg-card rounded-2xl border border-border p-8 mb-4 shadow-lg">
          <div className="font-bold text-xl text-foreground mb-6 text-left flex justify-between items-center">
            <span>Registered Vehicles</span>
            <Button
              variant="default"
              className="gradient-ev-green hover-glow"
              onClick={() => setAddDialogOpen(true)}
            >
              Add Vehicle
            </Button>
          </div>
          <DataTable
            columns={columns}
            data={vehicles as unknown as Record<string, unknown>[]}
            loading={vehiclesLoading}
            emptyMessage="No vehicles found. Add your first vehicle!"
          />
        </section>
        <Modal
          show={addDialogOpen}
          handleClose={handleCloseAddDialog}
          title="Add Vehicle"
          animate={false}
        >
          <div className="space-y-4 modal-content modal-container">
            <div>
              <Input
                placeholder="Model"
                value={newVehicle.model}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, model: e.target.value })
                }
                className="bg-background text-foreground border-border focus:ring-2 focus:ring-primary"
              />
              {addFieldErrors.model && (
                <div className="text-destructive text-sm mt-1">
                  {addFieldErrors.model}
                </div>
              )}
            </div>
            <div>
              <div className="dropdown-container">
                <Select
                  value={newVehicle.vehicleType}
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      vehicleType: e.target.value,
                    })
                  }
                  className="bg-background text-foreground border-border focus:ring-2 focus:ring-primary"
                >
                  <option value="" className="bg-background text-foreground">
                    Select Type
                  </option>
                  <option value="car" className="bg-background text-foreground">
                    Car
                  </option>
                  <option value="suv" className="bg-background text-foreground">
                    SUV
                  </option>
                  <option
                    value="motorcycle"
                    className="bg-background text-foreground"
                  >
                    Motorcycle
                  </option>
                  <option
                    value="scooter"
                    className="bg-background text-foreground"
                  >
                    Scooter
                  </option>
                  <option
                    value="truck"
                    className="bg-background text-foreground"
                  >
                    Truck
                  </option>
                  <option value="van" className="bg-background text-foreground">
                    Van
                  </option>
                  <option
                    value="other"
                    className="bg-background text-foreground"
                  >
                    Other
                  </option>
                </Select>
              </div>
              {addFieldErrors.vehicleType && (
                <div className="text-destructive text-sm mt-1">
                  {addFieldErrors.vehicleType}
                </div>
              )}
            </div>
            <div>
              <Input
                placeholder="Plate Number"
                value={newVehicle.plateNumber}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, plateNumber: e.target.value })
                }
                className="bg-background text-foreground border-border focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={handleCloseAddDialog}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleAddVehicle}
                disabled={addVehicleLoading}
              >
                {addVehicleLoading ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
