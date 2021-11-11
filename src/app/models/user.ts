// export interface Roles {
//     subscriber?: boolean;
//     analyst?: boolean;
//     editor?: boolean;
//     admin?: boolean;
// }

export interface User {
    order?: number;
    uid: string;
    email: string;
    imageURL: string;
    password: string;
    created_at: Date;
    firstName: string;
    familyName: string;
    phoneNumber: number;
    role: 'subscriber' | 'analyst' | 'editor' | 'admin';
}