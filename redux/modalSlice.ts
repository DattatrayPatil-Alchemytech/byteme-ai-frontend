import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserDetailsModalData {
  email?: string;
  name?: string;
  twitterUsername?: string;
  description?: string;
  isEditMode?: boolean;
}

interface ModalState {
  showUserModal: boolean;
  userModalData: UserDetailsModalData;
  userModalTitle: string;
}

const initialState: ModalState = {
  showUserModal: false,
  userModalData: {},
  userModalTitle: "",
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openUserModal: (
      state,
      action: PayloadAction<{
        data?: UserDetailsModalData;
        title?: string;
        isEditMode?: boolean;
      }>
    ) => {
      state.showUserModal = true;
      state.userModalData = {
        ...action.payload.data,
        isEditMode: action.payload.isEditMode || false,
      };
      state.userModalTitle = action.payload.title || "";
    },

    closeUserModal: (state) => {
      state.showUserModal = false;
      state.userModalData = {};
      state.userModalTitle = "";
    },

    updateUserModalData: (
      state,
      action: PayloadAction<Partial<UserDetailsModalData>>
    ) => {
      state.userModalData = { ...state.userModalData, ...action.payload };
    },

    setUserModalTitle: (state, action: PayloadAction<string>) => {
      state.userModalTitle = action.payload;
    },
  },
});

export const {
  openUserModal,
  closeUserModal,
  updateUserModalData,
  setUserModalTitle,
} = modalSlice.actions;

export default modalSlice.reducer;
