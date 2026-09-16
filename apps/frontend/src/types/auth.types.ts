export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    data: {
        token: string;
        user: User;
    };
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => void;
}