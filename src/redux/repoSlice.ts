import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface IContributorsProps {
    avatar: string;
    userName: string;
    contributions: number;
    fullName: string;
    company: string;
    location: string;
  };
  
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

  interface RepoState {
    repositories: Record<string, IRepoData>;
  }

  const initialState: RepoState = {
    repositories: {},
  };

  const repositorySlice = createSlice({
    name: "repositories",
    initialState,
    reducers: {
      addRepository: (state, action: PayloadAction<IRepoData>) => {
        const repoData = action.payload;
        state.repositories[`${repoData.owner}/${repoData.repo}`] = repoData;
      },
      clearRepositories: (state) => {
        const oneHour = 60 * 60 * 1000;
        Object.keys(state.repositories).forEach((key) => {
            if (Date.now() - state.repositories[key].lastUpdated > oneHour) {
                delete state.repositories[key];
            }
        });
      },
    },
  });

  export const { addRepository, clearRepositories } = repositorySlice.actions;
  export default repositorySlice.reducer;