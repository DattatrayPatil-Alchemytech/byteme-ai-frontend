import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserDetailsModalData {
  email?: string;
  name?: string;
  twitterUsername?: string;
  description?: string;
  isEditMode?: boolean;
}

export interface ModalData {
  userModal?: UserDetailsModalData;
  // Add more modal data types here as needed
  [key: string]: any;
}

export type ModalType = "USER_MODAL" | null;

interface ModalState {
  modalType: ModalType;
  modalData: ModalData;
  modalTitle: string;
  isOpen: boolean;

  // Legacy support - keep for backward compatibility
  showUserModal: boolean;
  userModalData: UserDetailsModalData;
  userModalTitle: string;
}

const initialState: ModalState = {
  modalType: null,
  modalData: {},
  modalTitle: "",
  isOpen: false,

  // Legacy support
  showUserModal: false,
  userModalData: {},
  userModalTitle: "",
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    // New generic modal actions
    openModal: (
      state,
      action: PayloadAction<{
        modalType: ModalType;
        data?: ModalData;
        title?: string;
      }>
    ) => {
      state.modalType = action.payload.modalType;
      state.modalData = action.payload.data || {};
      state.modalTitle = action.payload.title || "";
      state.isOpen = true;
    },

    closeModal: (state) => {
      state.modalType = null;
      state.modalData = {};
      state.modalTitle = "";
      state.isOpen = false;
    },

    updateModalData: (state, action: PayloadAction<ModalData>) => {
      state.modalData = { ...state.modalData, ...action.payload };
    },

    setModalTitle: (state, action: PayloadAction<string>) => {
      state.modalTitle = action.payload;
    },

    // Legacy actions - keep for backward compatibility
    openUserModal: (
      state,
      action: PayloadAction<{
        data?: UserDetailsModalData;
        title?: string;
        isEditMode?: boolean;
      }>
    ) => {
      // Update new state
      state.modalType = "USER_MODAL";
      state.modalData = { userModal: action.payload.data };
      state.modalTitle = action.payload.title || "";
      state.isOpen = true;

      // Update legacy state
      state.showUserModal = true;
      state.userModalData = {
        ...action.payload.data,
        isEditMode: action.payload.isEditMode || false,
      };
      state.userModalTitle = action.payload.title || "";
    },

    closeUserModal: (state) => {
      // Update new state
      state.modalType = null;
      state.modalData = {};
      state.modalTitle = "";
      state.isOpen = false;

      // Update legacy state
      state.showUserModal = false;
      state.userModalData = {};
      state.userModalTitle = "";
    },
  },
});

export const {
  // New generic actions
  openModal,
  closeModal,
  updateModalData,
  setModalTitle,

  // Legacy actions
  openUserModal,
  closeUserModal,
} = modalSlice.actions;

export default modalSlice.reducer;
