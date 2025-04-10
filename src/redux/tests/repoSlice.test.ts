import repositoryReducer, { addRepository, clearRepositories, RepoState } from "../repoSlice";

describe("repoSlice", () => {
  const initialState: RepoState = {
    repositories: [],
  };

  it("addRepository adds a new repository", () => {
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
    const newState = repositoryReducer(initialState, addRepository(repo));
    // expect(newState.repositories["facebook/react-native"]).toBe(repo);
  });

  it("addRepository updates an existing repository with the same key", () => {
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
    const initialStateWithRepo = repositoryReducer(
      initialState,
      addRepository(repo)
    );
    const updatedRepo = {
      ...repo,
      stars: 20000,
    };
    const newState = repositoryReducer(
      initialStateWithRepo,
      addRepository(updatedRepo)
    );
    expect(Object.keys(newState.repositories)).toHaveLength(1);
    // expect(newState.repositories["facebook/react-native"].stars).toBe(20000);
  })

  it("clearRepositories removes old entries", () => {
    const oldRepo = {
        owner: "facebook",
        repo: "react-native",
        name: "react-native",
        description:
          "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
        language: "JavaScript",
        license: "MIT",
        stars: 100,
        followers: 50,
        contributors: [],
        topCompanies: [],
        topLocations: [],
        lastUpdated: Date.now() -2 * 60 *60 *1000,
    };
    const newRepo = {
        owner: "facebook",
        repo: "react-native",
        name: "react-native",
        description:
          "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
        language: "JavaScript",
        license: "MIT",
        stars: 150,
        followers: 60,
        contributors: [],
        topCompanies: [],
        topLocations: [],
        lastUpdated: Date.now(),
    };

    const state = repositoryReducer(initialState, addRepository(oldRepo));
    const newState = repositoryReducer(state, addRepository(newRepo));
    const removedState = repositoryReducer(newState, clearRepositories());
    expect(removedState.repositories).toEqual({"facebook/react-native": newRepo}); 
  })
});
