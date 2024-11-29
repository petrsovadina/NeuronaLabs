import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/router';
import PatientList from '@/components/patients/PatientList';
import { api } from '@/services/api';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock api service
jest.mock('@/services/api', () => ({
  api: {
    patients: {
      getAll: jest.fn(),
    },
  },
}));

describe('PatientList', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockPatients = {
    items: [
      {
        id: '1',
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
        gender: 'Male',
        lastDiagnosis: 'Healthy',
      },
      {
        id: '2',
        name: 'Jane Doe',
        dateOfBirth: '1992-02-02',
        gender: 'Female',
        lastDiagnosis: 'Check-up needed',
      },
    ],
    total: 2,
    page: 1,
    pageSize: 10,
    hasMore: false,
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (api.patients.getAll as jest.Mock).mockResolvedValue(mockPatients);
  });

  it('renders patient list correctly', async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <PatientList />
      </QueryClientProvider>
    );

    // Check if loading state is shown
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Wait for data to load
    const johnDoe = await screen.findByText('John Doe');
    expect(johnDoe).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('navigates to patient detail on row click', async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <PatientList />
      </QueryClientProvider>
    );

    // Wait for data to load
    const johnDoe = await screen.findByText('John Doe');
    fireEvent.click(johnDoe);

    expect(mockRouter.push).toHaveBeenCalledWith('/patients/1');
  });

  it('navigates to edit page when edit button is clicked', async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <PatientList />
      </QueryClientProvider>
    );

    // Wait for data to load
    const editButtons = await screen.findAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(mockRouter.push).toHaveBeenCalledWith('/patients/1/edit');
  });

  it('handles error state correctly', async () => {
    const queryClient = new QueryClient();
    (api.patients.getAll as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch')
    );

    render(
      <QueryClientProvider client={queryClient}>
        <PatientList />
      </QueryClientProvider>
    );

    const errorMessage = await screen.findByText('Failed to fetch');
    expect(errorMessage).toBeInTheDocument();
  });
});
