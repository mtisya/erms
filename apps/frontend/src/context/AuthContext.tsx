import {
    createContext,
    useContext,
    useState
} from "react";

import type {
    ReactNode
} from "react";

import {
    loginUser
} from "../services/authService";

import type {
    User,
    AuthContextType
} from "../types/auth.types";


const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );


interface AuthProviderProps {
    children: ReactNode;
}


export function AuthProvider({
    children
}: AuthProviderProps) {


    const [user, setUser] =
        useState<User | null>(() => {

            const storedUser =
                localStorage.getItem(
                    "auth_user"
                );

            return storedUser
                ? JSON.parse(storedUser)
                : null;

        });


    const [token, setToken] =
        useState<string | null>(() => {

            return localStorage.getItem(
                "auth_token"
            );

        });


    async function login(
        email: string,
        password: string
    ) {

        const response =
            await loginUser(
                email,
                password
            );


        const {
            token,
            user
        } = response.data;


        localStorage.setItem(
            "auth_token",
            token
        );


        localStorage.setItem(
            "auth_user",
            JSON.stringify(user)
        );


        setToken(token);
        setUser(user);
    }


    function logout() {

        localStorage.removeItem(
            "auth_token"
        );

        localStorage.removeItem(
            "auth_user"
        );


        setToken(null);
        setUser(null);
    }


    const value: AuthContextType = {

        user,

        token,

        isAuthenticated:
            Boolean(token),

        login,

        logout

    };


    return (

        <AuthContext.Provider
            value={value}
        >

            {children}

        </AuthContext.Provider>

    );
}


export function useAuth() {

    const context =
        useContext(AuthContext);


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    }


    return context;
}