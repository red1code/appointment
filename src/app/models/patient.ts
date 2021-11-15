export interface Patient {
    displayName: string;
    phoneNumber: string;
    created_by: string;
    created_at: Date;
    lastUpdate?: Date | 'Not updated';
    order?: number;
}