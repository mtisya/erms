import type {
    LoginResponse
} from "../types/auth.types";


const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";


export async function loginUser(
    email: string,
    password: string
) {

    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        }
    );


    const result =
        await response.json();


    if (!response.ok || !result.success) {

        throw new Error(
            result.message ||
            "Login failed"
        );

    }


    return result as LoginResponse;
}