"use client";

import { useState } from "react";
import toast from "react-hot-toast";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Use the standalone API helper function
      // Show success message
      toast.success("Profile updated successfully! 🎉", {
        duration: 4000,
        position: "top-right",
      });

      // Close modal after successful update
      onClose();
    } catch (error) {
      // Error toast will be shown automatically by the API middleware
      // But we can handle specific errors if needed
      console.error(`Profile update failed (${error}):`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onClose();
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
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all duration-200 bg-background/50 backdrop-blur-sm disabled:opacity-50"
            aria-label="Full name"
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
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all duration-200 bg-background/50 backdrop-blur-sm disabled:opacity-50"
            aria-label="Email address"
          />
        </div>

        <div>
          <input
            type="text"
            name="twitter"
            placeholder="Twitter Handle (optional)"
            value={formData.twitter}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all duration-200 bg-background/50 backdrop-blur-sm disabled:opacity-50"
            aria-label="Twitter handle"
          />
        </div>

        <div>
          <textarea
            name="description"
            placeholder="Tell us about yourself (optional)"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all duration-200 resize-none bg-background/50 backdrop-blur-sm disabled:opacity-50"
            aria-label="Description"
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 hover-lift border-2 border-primary/20 hover:border-primary/40"
            onClick={handleSkip}
            disabled={isSubmitting}
          >
            Skip for Now
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 gradient-aurora hover-glow text-white font-bold shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Saving...
              </>
            ) : (
              "🚀 Complete Profile"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
