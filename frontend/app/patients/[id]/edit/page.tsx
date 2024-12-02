'use client';

import React, { useState, useEffect } from 'react';
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent,
    CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { gql, useMutation, useQuery } from '@apollo/client';
import { Patient, PatientFormData } from '@/types/patient';
import { useParams, useRouter } from 'next/navigation';
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

const UPDATE_PATIENT = gql`
    mutation UpdatePatient($id: ID!, $patient: PatientUpdateInput!) {
        updatePatient(id: $id, patient: $patient) {
            id
            firstName
            lastName
            birthDate
            gender
            email
        }
    }
`;

export default function EditPatientPage() {
    const router = useRouter();
    const params = useParams();
    const patientId = params.id as string;

    const { loading: queryLoading, error: queryError, data } = useQuery(GET_PATIENT_DETAIL, {
        variables: { id: patientId }
    });

    const [patient, setPatient] = useState<PatientFormData>({
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: 'other',
        email: '',
        phoneNumber: '',
        address: {
            street: '',
            city: '',
            postalCode: '',
            country: ''
        },
        medicalRecordNumber: '',
        insuranceProvider: '',
        allergies: [],
        emergencyContact: {
            name: '',
            relationship: '',
            phoneNumber: ''
        }
    });

    useEffect(() => {
        if (data && data.patient) {
            const { patient: fetchedPatient } = data;
            setPatient({
                firstName: fetchedPatient.firstName,
                lastName: fetchedPatient.lastName,
                birthDate: fetchedPatient.birthDate.split('T')[0],
                gender: fetchedPatient.gender,
                email: fetchedPatient.email,
                phoneNumber: fetchedPatient.phoneNumber || '',
                address: fetchedPatient.address || {
                    street: '',
                    city: '',
                    postalCode: '',
                    country: ''
                },
                medicalRecordNumber: fetchedPatient.medicalRecordNumber || '',
                insuranceProvider: fetchedPatient.insuranceProvider || '',
                allergies: fetchedPatient.allergies || [],
                emergencyContact: fetchedPatient.emergencyContact || {
                    name: '',
                    relationship: '',
                    phoneNumber: ''
                }
            });
        }
    }, [data]);

    const [updatePatient, { loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_PATIENT, {
        onCompleted: (data) => {
            router.push(`/patients/${data.updatePatient.id}`);
        }
    });

    const handleSubmit = () => {
        updatePatient({
            variables: {
                id: patientId,
                patient: {
                    ...patient,
                    birthDate: new Date(patient.birthDate).toISOString()
                }
            }
        });
    };

    const updatePatientField = (field: string, value: string) => {
        setPatient(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const updateAddress = (field: string, value: string) => {
        setPatient(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [field]: value
            }
        }));
    };

    if (queryLoading) return <div>Načítání údajů pacienta...</div>;
    if (queryError) return <div>Chyba při načítání pacienta: {queryError.message}</div>;

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Upravit údaje pacienta</CardTitle>
                    <CardDescription>Změňte informace o pacientovi</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Jméno</Label>
                            <Input 
                                placeholder="Jméno" 
                                value={patient.firstName}
                                onChange={(e) => updatePatientField('firstName', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label>Příjmení</Label>
                            <Input 
                                placeholder="Příjmení" 
                                value={patient.lastName}
                                onChange={(e) => updatePatientField('lastName', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label>Datum narození</Label>
                            <Input 
                                type="date" 
                                value={patient.birthDate}
                                onChange={(e) => updatePatientField('birthDate', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label>Pohlaví</Label>
                            <Select 
                                value={patient.gender} 
                                onValueChange={(value) => updatePatientField('gender', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Vyberte pohlaví" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Muž</SelectItem>
                                    <SelectItem value="female">Žena</SelectItem>
                                    <SelectItem value="other">Jiné</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input 
                                type="email"
                                placeholder="Email" 
                                value={patient.email}
                                onChange={(e) => updatePatientField('email', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label>Telefon</Label>
                            <Input 
                                type="tel"
                                placeholder="Telefon" 
                                value={patient.phoneNumber}
                                onChange={(e) => updatePatientField('phoneNumber', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Adresa</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Ulice</Label>
                                <Input 
                                    placeholder="Ulice" 
                                    value={patient.address?.street || ''}
                                    onChange={(e) => updateAddress('street', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Město</Label>
                                <Input 
                                    placeholder="Město" 
                                    value={patient.address?.city || ''}
                                    onChange={(e) => updateAddress('city', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>PSČ</Label>
                                <Input 
                                    placeholder="PSČ" 
                                    value={patient.address?.postalCode || ''}
                                    onChange={(e) => updateAddress('postalCode', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Země</Label>
                                <Input 
                                    placeholder="Země" 
                                    value={patient.address?.country || ''}
                                    onChange={(e) => updateAddress('country', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Zdravotní informace</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Číslo zdravotního záznamu</Label>
                                <Input 
                                    placeholder="Číslo zdravotního záznamu" 
                                    value={patient.medicalRecordNumber || ''}
                                    onChange={(e) => updatePatientField('medicalRecordNumber', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Zdravotní pojišťovna</Label>
                                <Input 
                                    placeholder="Zdravotní pojišťovna" 
                                    value={patient.insuranceProvider || ''}
                                    onChange={(e) => updatePatientField('insuranceProvider', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {mutationError && (
                        <div className="mt-4 text-red-500">
                            Chyba při aktualizaci pacienta: {mutationError.message}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link href={`/patients/${patientId}`}>
                        <Button variant="outline">Zrušit</Button>
                    </Link>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={mutationLoading}
                    >
                        {mutationLoading ? 'Ukládání...' : 'Uložit změny'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
