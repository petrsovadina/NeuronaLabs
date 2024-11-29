import React from 'react';
import { useQuery } from 'react-query';
import { api } from '@/services/api';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import Button from '@/components/common/Button';

const DashboardPage: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery('dashboard-stats', async () => {
    const [patients, studies] = await Promise.all([
      api.patients.getAll(1, 0), // Get total count only
      // Add more stats queries here
    ]);

    return {
      totalPatients: patients.total,
      // Add more stats here
    };
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;

  return (
    <Layout title="Dashboard - NeuronaLabs">
      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button
              variant="primary"
              onClick={() => window.location.href = '/patients/new'}
            >
              Add Patient
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Stats cards */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Patients
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats?.totalPatients.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <a
                  href="/patients"
                  className="font-medium text-indigo-600 hover:text-indigo-900"
                >
                  View all
                </a>
              </div>
            </div>
          </div>

          {/* Add more stat cards here */}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Recent activity */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Activity
              </h3>
              <div className="mt-4">
                {/* Add activity feed here */}
                <p className="text-gray-500 text-sm">No recent activity</p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Quick Actions
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Button
                  variant="secondary"
                  onClick={() => window.location.href = '/patients/new'}
                  className="w-full justify-center"
                >
                  New Patient
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => window.location.href = '/studies/new'}
                  className="w-full justify-center"
                >
                  New Study
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => window.location.href = '/analytics'}
                  className="w-full justify-center"
                >
                  View Analytics
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => window.location.href = '/settings'}
                  className="w-full justify-center"
                >
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
