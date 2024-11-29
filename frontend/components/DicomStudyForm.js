import { useState } from 'react'

export default function DicomStudyForm({ dicomStudy, onSubmit }) {
  const [studyInstanceUid, setStudyInstanceUid] = useState(dicomStudy?.study_instance_uid || '')
  const [modality, setModality] = useState(dicomStudy?.modality || '')
  const [studyDate, setStudyDate] = useState(dicomStudy?.study_date || '')
  const [file, setFile] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ study_instance_uid: studyInstanceUid, modality, study_date: studyDate, file })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="studyInstanceUid" className="block text-sm font-medium text-gray-700">
          Study Instance UID
        </label>
        <input
          id="studyInstanceUid"
          type="text"
          value={studyInstanceUid}
          onChange={(e) => setStudyInstanceUid(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="modality" className="block text-sm font-medium text-gray-700">
          Modalita
        </label>
        <input
          id="modality"
          type="text"
          value={modality}
          onChange={(e) => setModality(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="studyDate" className="block text-sm font-medium text-gray-700">
          Datum studie
        </label>
        <input
          id="studyDate"
          type="date"
          value={studyDate}
          onChange={(e) => setStudyDate(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          DICOM soubor
        </label>
        <input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".dcm"
          className="mt-1 block w-full"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {dicomStudy ? 'Aktualizovat DICOM studii' : 'Přidat DICOM studii'}
      </button>
    </form>
  )
}

