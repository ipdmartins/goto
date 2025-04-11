import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useSelector } from "react-redux";
import { render, screen, waitFor, act } from "@testing-library/react";
import repositoryReducer, { addRepository, RepoState } from "../../repoSlice";
import "@testing-library/jest-dom";

// Simple component to display repo data
const RepoDisplay = () => {
  const repositories = useSelector((state: RootState) => state.repositories.repositories);
  return (
    <div>
      {repositories.length > 0 ? (
        <span data-testid="repo-name">{repositories[0].name}</span>
      ) : (
        "No repositories"
      )}
    </div>
  );
};

export type RootState = {
  repositories: RepoState;
};

describe("Repository slice Integration Tests", () => {
  const repo = {
    owner: "facebook",
    repo: "react-native",
    name: "react-native",
    description:
      "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
    language: "JavaScript",
    license: "MIT",
    stars: 10000,
    followers: 100,
    contributors: [],
    topCompanies: [],
    topLocations: [],
    lastUpdated: Date.now(),
  };

  it("renders a repository after dispatching addRepository", async () => {
    const store = configureStore({
      reducer: {
        repositories: repositoryReducer,
      },
    });

    render(
      <Provider store={store}>
        <RepoDisplay />
      </Provider>
    );

    expect(screen.getByText("No repositories")).toBeInTheDocument(); 
    await act(async () => {
    store.dispatch(addRepository(repo));
    });
    await waitFor(() => expect(screen.getByTestId("repo-name")).toHaveTextContent("react-native"))
  });
});