import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';

const GET_PATIENTS = gql`
  query {
    patients {
      id
      name
      dateOfBirth
      lastDiagnosis
    }
  }
`;

export default function Patients() {
  const { loading, error, data } = useQuery(GET_PATIENTS);

  if (loading) return <p>Načítání...</p>;
  if (error) return <p>Chyba: {error.message}</p>;

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>Seznam pacientů | NeuronaLabs</title>
      </Head>

      <main className="py-20">
        <h1 className="text-4xl font-bold mb-8">Seznam pacientů</h1>
        <ul>
          {data.patients.map(patient => (
            <li key={patient.id} className="mb-4">
              <Link 
                href={`/patients/${patient.id}`}
                className="text-blue-500 hover:text-blue-700"
              >
                {patient.name} -{' '}
                {new Date(patient.dateOfBirth).toLocaleDateString()} -{' '}
                {patient.lastDiagnosis}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
