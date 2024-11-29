import { useState } from 'react'

export default function DiagnosticDataForm({ diagnosticData, onSubmit }) {
  const [diagnosisType, setDiagnosisType] = useState(diagnosticData?.diagnosis_type || '')
  const [description, setDescription] = useState(diagnosticData?.description || '')
  const [date, setDate] = useState(diagnosticData?.date || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ diagnosis_type: diagnosisType, description, date })
  }

  return (
    <form onS<div>
        <label htmlFor="diagnosisType" className="block text-sm font-medium text-gray-700">
          Typ diagnózy
        </label>
        <input
          id="diagnosisType"
          type="text"
          value={diagnosisType}
          onChange={(e) => setDiagnosisType(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Popis
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows="3"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Datum
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <button
        type="submit"
        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {diagnosticData ? 'Aktualizovat diagnostická data' : 'Přidat diagnostická data'}
      </button>
    </form>
  )
}

