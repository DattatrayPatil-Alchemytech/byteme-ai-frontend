"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Modal from "./Modal";
import { Button } from "../ui/button";
import WalletConnect from "../auth/WalletConnect";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
}

export default function LoginModal({ show, onClose }: LoginModalProps) {
  const [step, setStep] = useState<"choice" | "email" | "otp">("choice");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Get user loading state from Redux
  const user = useSelector((state: RootState) => state.user);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Focus on email input when email form shows
  useEffect(() => {
    if (showEmailForm && emailInputRef.current) {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    }
  }, [showEmailForm]);

  // Focus on OTP input when step changes
  useEffect(() => {
    if (step === "otp" && otpInputRef.current) {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  // Timer countdown for resend button
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Start timer when OTP step begins
  useEffect(() => {
    if (step === "otp" && timer === 0) {
      setTimer(60); // 60 seconds countdown
      setCanResend(false);
    }
  }, [step, timer]);

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validateOtp = (otp: string): boolean => {
    if (!otp) {
      setOtpError("OTP is required");
      return false;
    }
    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return false;
    }
    if (!/^\d+$/.test(otp)) {
      setOtpError("OTP must contain only numbers");
      return false;
    }
    setOtpError("");
    return true;
  };

  const handleShowEmailForm = () => {
    setShowEmailForm(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) return;

    setIsSubmitting(true);
    try {
      // Simulate API call for sending OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("OTP sent to your email!", {
        duration: 4000,
        position: "top-right",
      });

      setStep("otp");
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      console.error("Email submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateOtp(otp)) return;

    setIsSubmitting(true);
    try {
      // Simulate API call for OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock OTP verification (accept any 6-digit number for now)
      toast.success("Login successful! Welcome! 🎉", {
        duration: 4000,
        position: "top-right",
      });

      setTimeout(() => {
        setStep("choice");
        setShowEmailForm(false);
        setEmail("");
        setOtp("");
        setTimer(0);
      }, 200);

      // Close modal and potentially redirect or update auth state
      onClose();
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
      console.error("OTP submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setIsSubmitting(true);
    try {
      // Simulate API call for resending OTP
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success("OTP resent to your email!", {
        duration: 3000,
        position: "top-right",
      });

      setTimer(60);
      setCanResend(false);
      setOtp(""); // Clear current OTP
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
      console.error("Resend OTP error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeEmail = () => {
    setStep("choice");
    setShowEmailForm(true);
    setOtp("");
    setTimer(0);
    setCanResend(false);
    setOtpError("");
  };

  const handleClose = () => {
    // Reset form when closing
    setStep("choice");
    setShowEmailForm(false);
    setEmail("");
    setOtp("");
    setEmailError("");
    setOtpError("");
    setTimer(0);
    setCanResend(false);
    setIsSubmitting(false);
    onClose();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Modal show={show} title="Welcome" handleClose={handleClose}>
      <div className="space-y-6">
        {/* Choice and Email Form (Combined View) */}
        {step === "choice" && (
          <div className="space-y-6">
            {/* Connect Wallet - Primary Option */}
            <div className="space-y-3">
              <div className="w-full">
                <WalletConnect
                  title="Connect Wallet"
                  disabled={user.isLoading}
                />
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Connect your wallet for a seamless Web3 experience
              </p>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Email Login Section */}
            {!showEmailForm ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleShowEmailForm}
                disabled={user.isLoading}
                className="w-full py-3 border-2 hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {user.isLoading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Connecting...
                  </>
                ) : (
                  "Login with Email"
                )}
              </Button>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    ref={emailInputRef}
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    placeholder="Enter your email address"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-background text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed ${
                      emailError
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-input"
                    }`}
                    aria-describedby={emailError ? "email-error" : undefined}
                  />
                  {emailError && (
                    <p
                      id="email-error"
                      className="mt-2 text-sm text-red-600 dark:text-red-400"
                    >
                      {emailError}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full gradient-ev-green hover-glow text-primary-foreground font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            )}
          </div>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <div className="space-y-4">
            {/* Email Display with Change Button */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
              <div>
                <p className="text-sm text-muted-foreground">Sending OTP to:</p>
                <p className="font-medium text-foreground">{email}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleChangeEmail}
                disabled={isSubmitting}
                className="text-xs hover:bg-accent hover:text-accent-foreground"
              >
                Change
              </Button>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Enter OTP
                </label>
                <input
                  ref={otpInputRef}
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(value);
                    setOtpError("");
                  }}
                  placeholder="000000"
                  maxLength={6}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-background text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed text-center font-mono text-lg tracking-widest ${
                    otpError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-input"
                  }`}
                  aria-describedby={otpError ? "otp-error" : undefined}
                />
                {otpError && (
                  <p
                    id="otp-error"
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                  >
                    {otpError}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className="w-full gradient-ev-green hover-glow text-primary-foreground font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Verifying...
                  </>
                ) : (
                  "Verify & Login"
                )}
              </Button>
            </form>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Didn&apos;t receive the code?
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOtp}
                disabled={!canResend || isSubmitting}
                className="text-sm text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {canResend ? "Resend OTP" : `Resend in ${formatTime(timer)}`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
