import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { createMemoryRouter, RouterProvider, type RouterProviderProps } from 'react-router-dom';
import Home from '../index';
import repoReducer from '../../../redux/repoSlice';
import '@testing-library/jest-dom';

global.fetch = jest.fn();

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

const createMockStore = () => {
  return configureStore({
    reducer: {
      repositories: repoReducer,
    },
  });
};

const renderWithProviders = (ui: React.ReactElement) => {
  const store = createMockStore();
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: ui
      }
    ],
    {
      initialEntries: ["/"],
      future: {
        v7_relativeSplatPath: true
      }
    }
  );

  return {
    store,
    ...render(
      <Provider store={store}>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </Provider>
    ),
  };
};

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component correctly', () => {
    renderWithProviders(<Home />);

    expect(screen.getByText('Open-Source Contribution Analyser')).toBeInTheDocument();
    expect(screen.getByTestId('home-owner-input')).toBeInTheDocument();
    expect(screen.getByTestId('home-repo-input')).toBeInTheDocument();
    expect(screen.getByTestId('home-results-input')).toBeInTheDocument();
  });

  it('handles form input changes', () => {
    renderWithProviders(<Home />);

    const ownerInput = screen.getByTestId('home-owner-input');
    const repoInput = screen.getByTestId('home-repo-input');
    const resultsInput = screen.getByTestId('home-results-input');

    fireEvent.change(ownerInput, { target: { value: 'facebook' } });
    fireEvent.change(repoInput, { target: { value: 'react' } });
    fireEvent.change(resultsInput, { target: { value: '50' } });

    expect(ownerInput).toHaveValue('facebook');
    expect(repoInput).toHaveValue('react');
    expect(resultsInput).toHaveValue(50);
  });

  it('validates results per page input', () => {
    renderWithProviders(<Home />);

    const resultsInput = screen.getByTestId('home-results-input');

    // Test minimum value
    fireEvent.change(resultsInput, { target: { value: '20' } });
    expect(resultsInput).toHaveValue(30);

    // Test maximum value
    fireEvent.change(resultsInput, { target: { value: '250' } });
    expect(resultsInput).toHaveValue(200);

    // Test valid value
    fireEvent.change(resultsInput, { target: { value: '100' } });
    expect(resultsInput).toHaveValue(100);
  });

  it('handles successful API calls', async () => {
    const mockRepoData = {
      name: 'react',
      description: 'A JavaScript library',
      language: 'JavaScript',
      license: { name: 'MIT' },
      stargazers_count: 1000,
      subscribers_count: 100,
    };

    const mockContributorsData = [
      {
        url: 'https://api.github.com/users/user1',
        contributions: 100,
      },
    ];

    const mockContributorData = {
      avatar_url: 'avatar1.jpg',
      login: 'user1',
      name: 'User One',
      company: 'Company A',
      location: 'Location A',
    };

    // Mock API responses
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRepoData),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockContributorsData),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockContributorData),
        })
      );

    renderWithProviders(<Home />);

    const ownerInput = screen.getByTestId('home-owner-input');
    const repoInput = screen.getByTestId('home-repo-input');
    
    fireEvent.change(ownerInput, { target: { value: 'facebook' } });
    fireEvent.change(repoInput, { target: { value: 'react' } });
    
    fireEvent.submit(screen.getByTestId('home-search-button').closest('form')!);

    await waitFor(() => {
      expect(screen.getByTestId('home-repo-name')).toHaveValue('react');
      expect(screen.getByTestId('home-repo-language')).toHaveValue('JavaScript');
      expect(screen.getByTestId('home-repo-license')).toHaveValue('MIT');
      expect(screen.getByTestId('home-repo-stars')).toHaveValue(String(1000));
      expect(screen.getByTestId('home-repo-description')).toHaveValue('A JavaScript library');
    });
  });

  it('handles API error correctly', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      })
    );

    renderWithProviders(<Home />);

    const ownerInput = screen.getByTestId('home-owner-input');
    const repoInput = screen.getByTestId('home-repo-input');
    
    fireEvent.change(ownerInput, { target: { value: 'invalid' } });
    fireEvent.change(repoInput, { target: { value: 'repo' } });
    
    fireEvent.submit(screen.getByTestId('home-search-button').closest('form')!);

    await waitFor(() => {
      expect(screen.getByTestId('home-error-message')).toBeInTheDocument();
    });
  });
}); 