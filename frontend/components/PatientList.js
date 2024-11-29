import { memo } from 'react';
import Link from 'next/link';

const PatientList = memo(({ patients }) => {
  return (
    <ul className="space-y-4">
      {patients.map(patient => (
        <li key={patient.id} className="border p-4 rounded">
          <Link href={`/patients/${patient.id}`}>
            <a className="text-blue-500 hover:text-blue-700 text-lg font-semibold">
              {patient.name}
            </a>
          </Link>
          <p>
            Datum narození:{' '}
            {new Date(patient.date_of_birth).toLocaleDateString()}
          </p>
          <p>Poslední diagnóza: {patient.last_diagnosis}</p>
        </li>
      ))}
    </ul>
  );
});

PatientList.displayName = 'PatientList';

export default PatientList;
