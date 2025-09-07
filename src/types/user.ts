export interface User {
    id: number,
    fullname: string,
    email: string,
    dateOfBirth: Date,
    password: string,
    role : 'user' | 'admin' | 'guest'
}

export type SlimUser = Pick<User,'id' |'fullname' | 'role' | 'dateOfBirth'>;