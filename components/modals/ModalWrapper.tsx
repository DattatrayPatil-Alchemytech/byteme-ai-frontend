"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { closeModal, ModalType } from "@/redux/modalSlice";
import UserModal from "./UserModal";
import LoginModal from "./LoginModal";
import Modal from "./Modal";
import { Button } from "../ui/button";

export default function ModalWrapper() {
  const dispatch = useDispatch();
  const { modalType, modalData, modalTitle, isOpen } = useSelector(
    (state: RootState) => state.modal
  );

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  // Don't render anything if no modal is open
  if (!isOpen || !modalType) {
    return null;
  }

  // Switch case to render different modals based on modalType
  const renderModal = () => {
    switch (modalType) {
      case "USER_MODAL":
        return <UserModal show={true} onClose={handleCloseModal} />;

      case "LOGIN_MODAL":
        return <LoginModal show={true} onClose={handleCloseModal} />;

      default:
        // Generic confirmation modal (if needed in the future)
        return (
          <Modal
            show={true}
            title={modalTitle || "Confirm Action"}
            handleClose={handleCloseModal}
          >
            <div className="text-center">
              <p className="mb-6 text-muted-foreground">
                {modalData.message || "Are you sure you want to proceed?"}
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1 hover-lift border-border hover:border-ring hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 gradient-ev-green hover-glow text-primary-foreground font-bold transition-all"
                  onClick={() => {
                    if (modalData.onConfirm) {
                      modalData.onConfirm();
                    }
                    handleCloseModal();
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </Modal>
        );
    }
  };

  return <>{renderModal()}</>;
}
