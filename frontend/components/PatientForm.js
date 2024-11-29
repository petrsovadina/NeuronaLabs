import { useState } from 'react'

export default function PatientForm({ patient, onSubmit }) {
  const [name, setName] = useState(patient?.name || '')
  const [dateOfBirth, setDateOfBirth] = useState(patient?.dateOfBirth || '')
  const [gender, setGender] = useState(patient?.gender || '')
  const [lastDiagnosis, setLastDiagnosis] = useState(patient?.lastDiagnosis || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ name, dateOfBirth, gender, lastDiagnosis })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Jméno
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
          Datum narození
        </label>
        <input
          id="dateOfBirth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
          Pohlaví
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Vyberte pohlaví</option>
          <option value="male">Muž</option>
          <option value="female">Žena</option>
          <option value="other">Jiné</option>
        </select>
      </div>
      <div>
        <label htmlFor="lastDiagnosis" className="block text-sm font-medium text-gray-700">
          Poslední diagnóza
        </label>
        <input
          id="lastDiagnosis"
          type="text"
          value={lastDiagnosis}
          onChange={(e) => setLastDiagnosis(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {patient ? 'Aktualizovat pacienta' : 'Přidat pacienta'}
      </button>
    </form>
  )
}

