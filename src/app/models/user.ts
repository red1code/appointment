export class Roles {
    subscriber?: boolean;
    analyst?: boolean;
    editor?: boolean;
    admin?: boolean;
}

export class User {
    id!: string;
    firstName!: string;
    familyName!: string;
    phoneNumber!: number;
    email!: string;
    created_at!: Date;
    password!: string;
    imageURL!: string;
    role!: Roles;
}