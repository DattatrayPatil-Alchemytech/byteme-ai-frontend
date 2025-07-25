"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Modal = DialogPrimitive.Root;

const ModalTrigger = DialogPrimitive.Trigger;

const ModalPortal = DialogPrimitive.Portal;

const ModalClose = DialogPrimitive.Close;

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/50 backdrop-blur-sm", className)}
    {...props}
  />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showClose?: boolean;
    size?: "sm" | "md" | "lg" | "xl" | "full";
  }
>(({ className, children, showClose = true, size = "md", ...props }, ref) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full max-h-full",
  };

  return (
    <ModalPortal>
      <ModalOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          // Base positioning and visibility
          "fixed z-50 w-full bg-white border shadow-lg",

          // Desktop: centered modal
          "sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
          "sm:rounded-lg sm:max-h-[90vh]",

          // Mobile: bottom drawer
          "left-0 right-0 bottom-0 sm:relative sm:left-auto sm:right-auto sm:bottom-auto",
          "max-h-[85vh] overflow-hidden",
          "rounded-t-2xl sm:rounded-xl",

          // Size variants
          `sm:${sizeClasses[size]}`,

          className
        )}
        {...props}
      >
        <div className="flex flex-col h-full max-h-[85vh] sm:max-h-[90vh]">
          {children}
        </div>
        {showClose && (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </ModalPortal>
  );
});
ModalContent.displayName = DialogPrimitive.Content.displayName;

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4 border-b", className)}
    {...props}
  />
));
ModalHeader.displayName = "ModalHeader";

const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto p-6", className)}
    {...props}
  />
));
ModalBody.displayName = "ModalBody";

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-6 pt-4 border-t bg-gray-50",
      className
    )}
    {...props}
  />
));
ModalFooter.displayName = "ModalFooter";

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-600", className)}
    {...props}
  />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

// Progress Bar Component for multi-step modals
const ModalProgressBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    steps: number;
    currentStep: number;
  }
>(({ className, steps, currentStep, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex space-x-2 px-6 py-4", className)}
    {...props}
  >
    {Array.from({ length: steps }, (_, i) => i + 1).map((step) => (
      <div
        key={step}
        className={cn(
          "flex-1 h-2 rounded-full transition-colors duration-200",
          step < currentStep
            ? "bg-blue-600"
            : step === currentStep
            ? "bg-blue-400"
            : "bg-gray-200"
        )}
      />
    ))}
  </div>
));
ModalProgressBar.displayName = "ModalProgressBar";

// Step Content Component
const ModalStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    step: number;
    currentStep: number;
  }
>(({ className, step, currentStep, children, ...props }, ref) => {
  if (step !== currentStep) return null;

  return (
    <div ref={ref} className={cn("space-y-4", className)} {...props}>
      {children}
    </div>
  );
});
ModalStep.displayName = "ModalStep";

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalTrigger,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalProgressBar,
  ModalStep,
};
