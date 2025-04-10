import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface IContributorsProps {
  avatar: string;
  userName: string;
  contributions: number;
  fullName: string;
  company: string;
  location: string;
}

export interface IRepoData {
  owner: string;
  repo: string;
  name: string;
  description: string;
  language: string;
  license: string;
  stars: number;
  followers: number;
  contributors: IContributorsProps[];
  topCompanies: [string, number][];
  topLocations: [string, number][];
  lastUpdated: number;
}

// export interface RepoState {
//   repositories: Record<string, IRepoData>;
// }

export interface RepoState {
  repositories: IRepoData[];
}

const initialState: RepoState = {
  repositories: [],
  // repositories: {},
};

const repositorySlice = createSlice({
  name: "repositories",
  initialState,
  reducers: {
    addRepository: (state, action: PayloadAction<IRepoData>) => {
      const repoData = action.payload;
      // state.repositories[`${repoData.owner}/${repoData.repo}`] = repoData;
      const key = `${repoData.owner}/${repoData.repo}`;
      const existingIndex = state.repositories.findIndex(
        (repo) => `${repo.owner}/${repo.repo}` === key
      );
      if (existingIndex >= 0) {
        state.repositories[existingIndex] = repoData; // Update if exists
      } else {
        state.repositories.push(repoData); // Add new
      }
    },
    clearRepositories: (state) => {
      const oneHour = 60 * 60 * 1000;
      state.repositories = state.repositories.filter(
        (repo) => Date.now() - repo.lastUpdated <= oneHour
      );
      // Object.keys(state.repositories).forEach((key) => {
      //   if (Date.now() - state.repositories[key].lastUpdated > oneHour) {
      //     delete state.repositories[key];
      //   }
      // });
    },
  },
});

export const { addRepository, clearRepositories } = repositorySlice.actions;
export default repositorySlice.reducer;
export const selectRepoByKey = (state: RootState, key: string): IRepoData | undefined =>
  state.repositories.repositories.find(
    (repo) => `${repo.owner}/${repo.repo}` === key
  );