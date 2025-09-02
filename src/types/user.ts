export interface User {
    id: number,
    name: string,
    email: string,
    dateOfBirth: Date,
    password: string,
    role : 'user' | 'admin' | 'guest'
}

export type SlimUser = Pick<User,'id' |'name' | 'role' | 'dateOfBirth'>;