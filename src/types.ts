export interface Student {
    id: string;
    name: string;
    dni: string;
    paid: boolean;
    amount: number;
    cannotPay: boolean;
    authorization: boolean;
    medication?: string;
    specialCare?: string;
    headacheMedication?: string;
    feverMedication?: string;
    emergencyContact?: string;
}
