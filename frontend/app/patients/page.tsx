'use client';

import React, { useState } from 'react';
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useQuery, gql } from '@apollo/client';
import { Patient } from '@/types/patient';
import Link from 'next/link';

const GET_PATIENTS = gql`
    query GetPatients {
        patients {
            id
            firstName
            lastName
            birthDate
            gender
            email
        }
    }
`;

export default function PatientsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { loading, error, data } = useQuery(GET_PATIENTS);

    const filteredPatients = data?.patients.filter((patient: Patient) => 
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Načítání pacientů...</div>;
    if (error) return <div>Chyba při načítání pacientů: {error.message}</div>;

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Seznam Pacientů</CardTitle>
                    <CardDescription>Přehled všech registrovaných pacientů</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between mb-4">
                        <Input 
                            placeholder="Vyhledat pacienta" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-1/2"
                        />
                        <Link href="/patients/new">
                            <Button>Přidat pacienta</Button>
                        </Link>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Jméno</TableHead>
                                <TableHead>Příjmení</TableHead>
                                <TableHead>Datum narození</TableHead>
                                <TableHead>Pohlaví</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Akce</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPatients.map((patient: Patient) => (
                                <TableRow key={patient.id}>
                                    <TableCell>{patient.firstName}</TableCell>
                                    <TableCell>{patient.lastName}</TableCell>
                                    <TableCell>{new Date(patient.birthDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{patient.gender}</TableCell>
                                    <TableCell>{patient.email}</TableCell>
                                    <TableCell>
                                        <Link href={`/patients/${patient.id}`}>
                                            <Button variant="outline" size="sm">Detail</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
