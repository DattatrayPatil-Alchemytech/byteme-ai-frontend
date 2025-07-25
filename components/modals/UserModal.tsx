"use client";
import { useState } from "react";
import Modal from "./Modal";
import { Button } from "../ui/button";

interface UserModalProps {
  show: boolean;
  onClose: () => void;
}

export default function UserModal({ show, onClose }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    twitter: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to backend or smart contract
    console.log("User data submitted:", formData);
    onClose(); // Close modal on submit
  };

  return (
    <Modal
      show={show}
      title="Welcome! Complete Your Profile"
      handleClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all duration-200 bg-background/50 backdrop-blur-sm"
          />
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all duration-200 bg-background/50 backdrop-blur-sm"
          />
        </div>

        <div>
          <input
            type="text"
            name="twitter"
            placeholder="Twitter Handle (optional)"
            value={formData.twitter}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all duration-200 bg-background/50 backdrop-blur-sm"
          />
        </div>

        <div>
          <textarea
            name="description"
            placeholder="Tell us about yourself (optional)"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all duration-200 resize-none bg-background/50 backdrop-blur-sm"
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 hover-lift border-2 border-primary/20 hover:border-primary/40"
            onClick={onClose}
          >
            Skip for Now
          </Button>
          <Button
            type="submit"
            className="flex-1 gradient-aurora hover-glow text-white font-bold shadow-2xl"
          >
            🚀 Complete Profile
          </Button>
        </div>
      </form>
    </Modal>
  );
}
