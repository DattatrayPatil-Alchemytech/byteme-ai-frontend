"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Award,
  Star,
  Pencil,
  Wallet,
  Trophy,
  Leaf,
  Zap,
  Target,
} from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Modal from "@/components/modals/Modal";
import { useDispatch } from "react-redux";
import { openModal } from "@/redux/modalSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  getUserVehicles,
  VehicleData,
  addVehicle,
  deleteVehicle,
  getUserProfile,
  updateVehicle,
} from "@/lib/apiHelpers/profile";
import toast from "react-hot-toast";

// TypeScript interfaces
interface UserProfile {
  username: string;
  email: string;
  walletAddress: string;
  b3trBalance: number;
  currentTier: string;
  totalPoints: number;
  totalCarbonSaved: number;
  totalMileage: number;
  profileImageUrl?: string;
}

interface Badge {
  id: number;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Vehicle {
  id: string;
  customName: string | null;
  model: string;
  vehicleType: string;
  plateNumber: string | null;
  make: string | null;
  year: number | null;
  emissionFactor: string | null;
  isPrimary: boolean | null;
  isActive: boolean | null;
}

interface NewVehicle {
  model: string;
  vehicleType: string;
  plateNumber: string;
}

interface FieldErrors {
  model?: string;
  vehicleType?: string;
  plateNumber?: string;
}

// Mock data for badges
const mockBadges: Badge[] = [
  { id: 1, name: "Eco Warrior", icon: Award },
  { id: 2, name: "EV Pioneer", icon: Star },
];

export default function UserProfilePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState<NewVehicle>({
    model: "",
    vehicleType: "",
    plateNumber: "",
  });
  const [addError, setAddError] = useState("");
  const [addFieldErrors, setAddFieldErrors] = useState<FieldErrors>({});
  const [addVehicleLoading, setAddVehicleLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [editLoadingId, setEditLoadingId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProfileLoading, setUserProfileLoading] = useState(true);
  const [userProfileError, setUserProfileError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const { modalType, isOpen } = useSelector((state: RootState) => state.modal);

  useEffect(() => {
    setUserProfileLoading(true);
    getUserProfile()
      .then((data) => {
        setUserProfile(data as unknown as UserProfile);
        setUserProfileError("");
      })
      .catch((err: Error) => {
        setUserProfileError(err?.message || "Failed to load profile");
        setUserProfile(null);
      })
      .finally(() => {
        setUserProfileLoading(false);
      });
  }, []);

  useEffect(() => {
    setVehiclesLoading(true);
    getUserVehicles()
      .then((data: VehicleData[]) => {
        setVehicles(data as Vehicle[]);
      })
      .catch((err: Error) => {
        console.error("Failed to fetch vehicles", err);
        setVehicles([]);
      })
      .finally(() => {
        setVehiclesLoading(false);
      });
  }, []);

  // Listen for modal state changes to refresh profile data
  useEffect(() => {
    // If USER_MODAL was open and is now closed, refresh the profile data
    if (!isOpen && modalType === null) {
      // Small delay to ensure the modal has fully closed and any updates are processed
      const timer = setTimeout(() => {
        setUserProfileLoading(true);
        getUserProfile()
          .then((data) => {
            setUserProfile(data as unknown as UserProfile);
            setUserProfileError("");
          })
          .catch((err: Error) => {
            setUserProfileError(err?.message || "Failed to load profile");
            setUserProfile(null);
          })
          .finally(() => {
            setUserProfileLoading(false);
          });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen, modalType]);

  const handleEdit = (row: Vehicle) => {
    setEditId(row.id);
    setEditName(row.customName || row.model || "");
    setEditError("");
  };

  const handleSave = async (row: Vehicle) => {
    if (!editName.trim()) {
      setEditError("Name cannot be empty");
      return;
    }
    setEditLoadingId(row.id);
    try {
      // Only send the required keys for update
      const updateObj = {
        vehicleType: row.vehicleType,
        customName: editName.trim(),
        make: row.make || undefined,
        model: row.model,
        year: row.year || undefined,
        plateNumber: row.plateNumber || undefined,
        emissionFactor: row.emissionFactor || undefined,
        isPrimary: row.isPrimary || undefined,
        isActive: row.isActive || undefined,
      };
      await updateVehicle(row.id, updateObj);
      toast.success("Vehicle name updated successfully!");
      setVehiclesLoading(true);
      const data = await getUserVehicles();
      setVehicles(data as Vehicle[]);
      setEditId(null);
      setEditName("");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update vehicle name";
      toast.error(errorMessage);
      setEditError(errorMessage);
    } finally {
      setEditLoadingId(null);
      setVehiclesLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    setDeleteLoadingId(id);
    try {
      await deleteVehicle(id);
      toast.success("Vehicle deleted successfully!");
      setVehiclesLoading(true);
      const data = await getUserVehicles();
      setVehicles(data as Vehicle[]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete vehicle";
      toast.error(errorMessage);
    } finally {
      setDeleteLoadingId(null);
      setVehiclesLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    const errors: FieldErrors = {};
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
      setVehicles(data as Vehicle[]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add vehicle";
      toast.error(errorMessage);
      setAddError(errorMessage);
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

  // Helper function to format wallet address
  const formatWalletAddress = (address: string): string => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Helper function to format tier
  const formatTier = (tier: string): string => {
    if (!tier) return "N/A";
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  // Helper function to get tier color
  const getTierColor = (tier: string): string => {
    switch (tier?.toLowerCase()) {
      case "bronze":
        return "text-amber-600 dark:text-amber-400";
      case "silver":
        return "text-gray-600 dark:text-gray-300";
      case "gold":
        return "text-yellow-600 dark:text-yellow-400";
      case "platinum":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-muted-foreground";
    }
  };

  // DataTable columns
  const columns: Column[] = [
    {
      key: "customName",
      label: "Name",
      render: (value, row) => {
        const vehicle = row as unknown as Vehicle;
        return editId === vehicle.id ? (
          <>
            <input
              className="border border-border rounded px-2 py-1 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={editName}
              onChange={(e) => {
                setEditName(e.target.value);
                if (editError) setEditError("");
              }}
              onBlur={() => handleSave(vehicle)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave(vehicle);
              }}
              autoFocus
            />
            {editError && (
              <div className="text-xs text-destructive mt-1">{editError}</div>
            )}
          </>
        ) : (
          <span className="flex flex-row items-center gap-1">
            <span className="text-foreground leading-none">
              {vehicle.customName || vehicle.model || "Unnamed Vehicle"}
            </span>
            <button
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              title="Edit name"
              onClick={() => handleEdit(vehicle)}
              aria-label="Edit name"
              disabled={editLoadingId === vehicle.id}
            >
              {editLoadingId === vehicle.id ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Pencil className="w-4 h-4 align-middle" />
              )}
            </button>
          </span>
        );
      },
    },
    {
      key: "vehicleType",
      label: "Type",
      render: (value) => (
        <span className="capitalize text-muted-foreground">
          {value as string}
        </span>
      ),
    },
    {
      key: "plateNumber",
      label: "Number Plate",
      render: (value) => {
        const stringValue = value as string | null;
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
        const vehicle = row as unknown as Vehicle;
        return (
          <div className="flex gap-2">
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto min-w-0 text-destructive"
              onClick={() => handleRemove(vehicle.id)}
              disabled={deleteLoadingId === vehicle.id}
            >
              {deleteLoadingId === vehicle.id ? "Removing..." : "Remove"}
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

        /* Responsive grid */
        .profile-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          align-items: stretch;
        }

        .wallet-balance-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          align-items: stretch;
        }

        @media (min-width: 640px) {
          .wallet-balance-container {
            grid-template-columns: 1fr 1fr;
          }
        }

        .profile-grid > * {
          width: 100%;
          min-height: 140px;
        }

        .wallet-balance-container > * {
          width: 100%;
          min-height: 140px;
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-6 mt-6 mb-10 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 ml-1 flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 shadow-sm"
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

        {/* Profile Header */}
        <section className="flex flex-col items-center bg-card rounded-2xl border border-border p-8 sm:p-10 shadow-lg relative">
          {/* Update Profile Button - Top Right */}
          {userProfile && (
            <Button
              variant="outline"
              className="absolute top-6 right-6 rounded-lg border border-primary text-primary bg-transparent hover:bg-primary hover:text-white hover:shadow-lg transition-all duration-300 p-2.5"
              onClick={() =>
                dispatch(
                  openModal({
                    modalType: "USER_MODAL",
                    title: "Welcome! Complete Your Profile",
                  })
                )
              }
              title="Update Profile"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
          
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-primary mb-6 flex items-center justify-center bg-muted">
            {userProfile?.profileImageUrl ? (
              <img
                src={userProfile.profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="w-16 h-16 sm:w-20 sm:h-20 text-primary" />
            )}
          </div>
          <div className="text-center">
            {userProfileLoading ? (
              <div className="text-base text-muted-foreground mb-2">
                Loading profile...
              </div>
            ) : userProfileError ? (
              <div className="text-base text-destructive mb-2">
                {userProfileError}
              </div>
            ) : userProfile ? (
              <>
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {userProfile.username || "User"}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground mb-4">
                  {userProfile.email}
                </div>
                <div
                  className={`inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm ${getTierColor(
                    userProfile.currentTier
                  )}`}
                >
                  {formatTier(userProfile.currentTier)} Tier
                </div>
              </>
            ) : null}
          </div>
        </section>

        {userProfile && (
          <div className="wallet-balance-container">
            {/* Wallet Address */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Wallet Address
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your connected wallet
                  </p>
                </div>
              </div>
              <div className="font-mono text-sm bg-muted rounded-lg p-3 text-foreground">
                {formatWalletAddress(userProfile.walletAddress)}
              </div>
            </div>

            {/* B3TR Balance */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    B3TR Balance
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your token balance
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {userProfile.b3trBalance || 0} B3TR
              </div>
            </div>
          </div>
        )}

        {/* Profile Stats Grid */}
        {userProfile && (
          <div className="profile-grid">
            {/* Total Points */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Total Points
                  </h3>
                  <p className="text-sm text-muted-foreground">Earned points</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {userProfile.totalPoints || 0}
              </div>
            </div>

            {/* Total Carbon Saved */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-600/10 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Carbon Saved
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Total CO₂ saved
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {userProfile.totalCarbonSaved || 0} kg
              </div>
            </div>

            {/* Total Mileage */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Total Mileage
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Distance traveled
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {userProfile.totalMileage || 0} km
              </div>
            </div>
          </div>
        )}

        {/* Badges Section */}
        {/* <section className="bg-card rounded-2xl border border-border p-8 shadow-lg">
          <div className="font-bold text-xl text-foreground mb-6 text-left">
            Badges & Achievements
          </div>
          <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
            {mockBadges.map((badge: Badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.id} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-primary mb-2 flex items-center justify-center bg-muted">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-xs text-center text-muted-foreground font-medium">
                    {badge.name}
                  </span>
                </div>
              );
            })}
          </div>
        </section> */}

        {/* Vehicles Section */}
        <section className="bg-card rounded-2xl border border-border p-8 shadow-lg">
          <div className="font-bold text-xl text-foreground mb-6 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span>Registered Vehicles</span>
            <Button
              variant="default"
              className="gradient-ev-green hover-glow w-full sm:w-auto"
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

        {/* Add Vehicle Modal */}
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
