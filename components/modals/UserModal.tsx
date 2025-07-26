"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { updateProfile } from "@/redux/userSlice";
import {
  updateUserProfile,
  type UserProfileUpdatePayload,
} from "@/lib/apiHelpers/user";
import toast from "react-hot-toast";
import Modal from "./Modal";
import { Button } from "../ui/button";

interface UserModalProps {
  show: boolean;
  onClose: () => void;
}

interface ValidationErrors {
  username?: string;
  email?: string;
  profileImageUrl?: string;
}

export default function UserModal({ show, onClose }: UserModalProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const isLoading = useSelector((state: RootState) => state.user.isLoading);

  const [formData, setFormData] = useState<UserProfileUpdatePayload>({
    username: user?.username || "",
    email: user?.email || "",
    profileImageUrl: user?.profileImageUrl || "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (formData.username.trim().length > 30) {
      newErrors.username = "Username must be less than 30 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Profile image URL validation (optional)
    if (formData.profileImageUrl && formData.profileImageUrl.trim()) {
      try {
        new URL(formData.profileImageUrl.trim());
      } catch {
        newErrors.profileImageUrl = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof UserProfileUpdatePayload,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const trimmedData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        profileImageUrl: formData.profileImageUrl?.trim() || undefined,
      };

      const updatedUser = await updateUserProfile(trimmedData);
      dispatch(updateProfile(updatedUser));

      toast.success("Profile updated successfully! 🎉", {
        duration: 4000,
        position: "top-right",
      });

      setErrors({});
      onClose();
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile. Please try again.");
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
            placeholder="Username"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            disabled={isSubmitting || isLoading}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-background text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.username
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-input"
            }`}
            aria-label="Username"
          />
          {errors.username && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.username}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={isSubmitting || isLoading}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-background text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-input"
            }`}
            aria-label="Email address"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Profile Image URL (optional)"
            value={formData.profileImageUrl}
            onChange={(e) =>
              handleInputChange("profileImageUrl", e.target.value)
            }
            disabled={isSubmitting || isLoading}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-background text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.profileImageUrl
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-input"
            }`}
            aria-label="Profile image URL"
          />
          {errors.profileImageUrl && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.profileImageUrl}
            </p>
          )}
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 hover-lift border-border hover:border-ring hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={handleSkip}
            disabled={isSubmitting || isLoading}
          >
            Skip for Now
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex-1 gradient-ev-green hover-glow text-primary-foreground font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Updating Profile...
              </>
            ) : (
              "🚀 Update Profile"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
