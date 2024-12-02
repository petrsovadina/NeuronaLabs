'use client';

import React, { useState } from 'react';
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent,
    CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { gql, useQuery } from '@apollo/client';
import { Patient } from '@/types/patient';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const GET_PATIENT_DETAIL = gql`
    query GetPatientDetail($id: ID!) {
        patient(id: $id) {
            id
            firstName
            lastName
            birthDate
            gender
            email
            phoneNumber
            address {
                street
                city
                postalCode
                country
            }
            medicalRecordNumber
            insuranceProvider
            allergies
            emergencyContact {
                name
                relationship
                phoneNumber
            }
        }
    }
`;

export default function PatientDetailPage() {
    const params = useParams();
    const patientId = params.id as string;

    const { loading, error, data } = useQuery(GET_PATIENT_DETAIL, {
        variables: { id: patientId }
    });

    if (loading) return <div>Načítání detailu pacienta...</div>;
    if (error) return <div>Chyba při načítání detailu pacienta: {error.message}</div>;

    const patient: Patient = data.patient;

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Detail pacienta</CardTitle>
                    <CardDescription>Kompletní informace o pacientovi</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Základní informace</h3>
                            <p><strong>Jméno:</strong> {patient.firstName} {patient.lastName}</p>
                            <p><strong>Datum narození:</strong> {new Date(patient.birthDate).toLocaleDateString()}</p>
                            <p><strong>Pohlaví:</strong> {patient.gender === 'male' ? 'Muž' : patient.gender === 'female' ? 'Žena' : 'Jiné'}</p>
                            <p><strong>Email:</strong> {patient.email}</p>
                            {patient.phoneNumber && <p><strong>Telefon:</strong> {patient.phoneNumber}</p>}
                        </div>
                        
                        {patient.address && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Adresa</h3>
                                <p>{patient.address.street}</p>
                                <p>{patient.address.city}, {patient.address.postalCode}</p>
                                <p>{patient.address.country}</p>
                            </div>
                        )}
                        
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Zdravotní informace</h3>
                            {patient.medicalRecordNumber && <p><strong>Číslo zdravotního záznamu:</strong> {patient.medicalRecordNumber}</p>}
                            {patient.insuranceProvider && <p><strong>Zdravotní pojišťovna:</strong> {patient.insuranceProvider}</p>}
                            {patient.allergies && patient.allergies.length > 0 && (
                                <div>
                                    <strong>Alergie:</strong>
                                    <ul>
                                        {patient.allergies.map((allergy, index) => (
                                            <li key={index}>{allergy}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        
                        {patient.emergencyContact && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Kontakt v případě nouze</h3>
                                <p><strong>Jméno:</strong> {patient.emergencyContact.name}</p>
                                <p><strong>Vztah:</strong> {patient.emergencyContact.relationship}</p>
                                <p><strong>Telefon:</strong> {patient.emergencyContact.phoneNumber}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link href="/patients">
                        <Button variant="outline">Zpět na seznam</Button>
                    </Link>
                    <Link href={`/patients/${patient.id}/edit`}>
                        <Button>Upravit údaje</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
