export class Patient {
    constructor(public id: string,
                public fullName: string,
                public phoneNumber: string,
                public created_at: Date,
                public created_by: string) {}    
}
