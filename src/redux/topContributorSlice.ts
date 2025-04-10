import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface IContributorProps {
  avatar: string;
  userName: string;
  contributions: number;
  fullName: string;
  company: string;
  location: string;
}

export interface ContributorState {
  contributor: IContributorProps | null;
}

const initialState: ContributorState = {
  contributor: null
};

const contributorSlice = createSlice({
  name: "contributor",
  initialState,
  reducers: {
    addTopContributor: (state, action: PayloadAction<IContributorProps>) => {
      const contributorData = action.payload;
      state.contributor = contributorData;
    },
    clearTopContributor: (state) => {
      state.contributor = null;
    },
  },
});

export const { addTopContributor, clearTopContributor } = contributorSlice.actions;
export default contributorSlice.reducer;
