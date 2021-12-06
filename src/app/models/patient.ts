import { Timestamp } from "rxjs/internal/operators/timestamp";

export interface Patient {
    displayName: string;
    phoneNumber: string;
    created_by: string;
    created_at: any;
    lastUpdate?: any;
    order?: number;
    rdvID?: string;
}