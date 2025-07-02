export interface User {
    id: number,
    name: string,
    email: string,
    dateOfBirth: Date,
    password: string,
    role : 'user' | 'admin'
}

export type SlimUser = Pick<User,'id' |'name' | 'role'>;