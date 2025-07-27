"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Modal from "@/components/modals/Modal";

interface AddVehicleModalProps {
  show: boolean;
  onClose: () => void;
  handleSubmit: (vehicleData: { model: string; vehicleType: string; plateNumber: string }) => Promise<void>;
  loading?: boolean;
}

interface FieldErrors {
  model?: string;
  vehicleType?: string;
  plateNumber?: string;
}

export default function AddVehicleModal({ show, onClose, handleSubmit, loading = false }: AddVehicleModalProps) {
  const [newVehicle, setNewVehicle] = useState({
    model: "",
    vehicleType: "",
    plateNumber: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleFormSubmit = async () => {
    // Validate form
    const errors: FieldErrors = {};
    if (!newVehicle.model.trim()) errors.model = "Model is required";
    if (!newVehicle.vehicleType.trim()) errors.vehicleType = "Type is required";
    
    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) return;

    try {
      await handleSubmit(newVehicle);
      // Reset form on success
      setNewVehicle({ model: "", vehicleType: "", plateNumber: "" });
      setFieldErrors({});
    } catch (error) {
      // Error handling is done in the parent component
      console.error("Error adding vehicle:", error);
    }
  };

  const handleClose = () => {
    setNewVehicle({ model: "", vehicleType: "", plateNumber: "" });
    setFieldErrors({});
    onClose();
  };

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      title="Add Vehicle"
      animate={false}
    >
      <div className="space-y-4 modal-content modal-container">
        <div>
          <Input
            placeholder="Model"
            value={newVehicle.model}
            onChange={(e) => {
              setNewVehicle({ ...newVehicle, model: e.target.value });
              if (fieldErrors.model) {
                setFieldErrors({ ...fieldErrors, model: undefined });
              }
            }}
            className="bg-background text-foreground border-border focus:ring-2 focus:ring-primary"
          />
          {fieldErrors.model && (
            <div className="text-destructive text-sm mt-1">
              {fieldErrors.model}
            </div>
          )}
        </div>
        
        <div>
          <div className="dropdown-container">
            <Select
              value={newVehicle.vehicleType}
              onChange={(e) => {
                setNewVehicle({ ...newVehicle, vehicleType: e.target.value });
                if (fieldErrors.vehicleType) {
                  setFieldErrors({ ...fieldErrors, vehicleType: undefined });
                }
              }}
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
              <option value="motorcycle" className="bg-background text-foreground">
                Motorcycle
              </option>
              <option value="scooter" className="bg-background text-foreground">
                Scooter
              </option>
              <option value="truck" className="bg-background text-foreground">
                Truck
              </option>
              <option value="van" className="bg-background text-foreground">
                Van
              </option>
              <option value="other" className="bg-background text-foreground">
                Other
              </option>
            </Select>
          </div>
          {fieldErrors.vehicleType && (
            <div className="text-destructive text-sm mt-1">
              {fieldErrors.vehicleType}
            </div>
          )}
        </div>
        
        <div>
          <Input
            placeholder="Plate Number"
            value={newVehicle.plateNumber}
            onChange={(e) => {
              setNewVehicle({ ...newVehicle, plateNumber: e.target.value });
              if (fieldErrors.plateNumber) {
                setFieldErrors({ ...fieldErrors, plateNumber: undefined });
              }
            }}
            className="bg-background text-foreground border-border focus:ring-2 focus:ring-primary"
          />
          {fieldErrors.plateNumber && (
            <div className="text-destructive text-sm mt-1">
              {fieldErrors.plateNumber}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleFormSubmit}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>
    </Modal>
  );
} 