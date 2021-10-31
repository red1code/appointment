export class Patient {
    fullName!: string;
    phoneNumber!: string;
    created_by!: string;
    created_at!: Date;
    lastUpdate?: Date;
    order!: number;
}