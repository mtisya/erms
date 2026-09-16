export interface CreateUserInput {

    firstName: string;

    lastName: string;

    email: string;

    password: string;

    roleId: string;

}


export interface UpdateUserInput {

    firstName?: string;

    lastName?: string;

    email?: string;

    active?: boolean;

    roleId?: string;

}