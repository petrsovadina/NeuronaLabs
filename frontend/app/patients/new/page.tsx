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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { gql, useMutation } from '@apollo/client';
import { PatientFormData } from '@/types/patient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CREATE_PATIENT = gql`
    mutation CreatePatient($patient: PatientCreateInput!) {
        createPatient(patient: $patient) {
            id
            firstName
            lastName
            birthDate
            gender
            email
        }
    }
`;

export default function NewPatientPage() {
    const router = useRouter();
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

    const [createPatient, { loading, error }] = useMutation(CREATE_PATIENT, {
        onCompleted: (data) => {
            router.push(`/patients/${data.createPatient.id}`);
        }
    });

    const handleSubmit = () => {
        // Zde můžete přidat validaci před odesláním
        createPatient({
            variables: {
                patient: {
                    ...patient,
                    birthDate: new Date(patient.birthDate).toISOString()
                }
            }
        });
    };

    const updatePatient = (field: string, value: string) => {
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

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Přidat nového pacienta</CardTitle>
                    <CardDescription>Vyplňte základní informace o pacientovi</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Jméno</Label>
                            <Input 
                                placeholder="Jméno" 
                                value={patient.firstName}
                                onChange={(e) => updatePatient('firstName', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label>Příjmení</Label>
                            <Input 
                                placeholder="Příjmení" 
                                value={patient.lastName}
                                onChange={(e) => updatePatient('lastName', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label>Datum narození</Label>
                            <Input 
                                type="date" 
                                value={patient.birthDate}
                                onChange={(e) => updatePatient('birthDate', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label>Pohlaví</Label>
                            <Select 
                                value={patient.gender} 
                                onValueChange={(value) => updatePatient('gender', value)}
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
                                onChange={(e) => updatePatient('email', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label>Telefon</Label>
                            <Input 
                                type="tel"
                                placeholder="Telefon" 
                                value={patient.phoneNumber}
                                onChange={(e) => updatePatient('phoneNumber', e.target.value)}
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
                                    onChange={(e) => updatePatient('medicalRecordNumber', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Zdravotní pojišťovna</Label>
                                <Input 
                                    placeholder="Zdravotní pojišťovna" 
                                    value={patient.insuranceProvider || ''}
                                    onChange={(e) => updatePatient('insuranceProvider', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 text-red-500">
                            Chyba při vytváření pacienta: {error.message}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link href="/patients">
                        <Button variant="outline">Zrušit</Button>
                    </Link>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={loading}
                    >
                        {loading ? 'Ukládání...' : 'Vytvořit pacienta'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
