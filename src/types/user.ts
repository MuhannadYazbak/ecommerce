export interface User {
    id: number,
    fullname: string,
    email: string,
    dateOfBirth: Date,
    password: string,
    role : 'user' | 'admin' | 'guest'
}

export interface TranslatedUser {
    id: number,
    enName: string,
    arName: string,
    heName: string,
    email: string,
    dateOfBirth: Date,
    password: string
}

export type SlimUser = Pick<User,'id' |'fullname' | 'role' | 'dateOfBirth'>;
