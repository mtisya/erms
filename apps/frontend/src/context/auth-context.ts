import { createContext } from "react";
import type { AuthContextType } from "../types/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export default AuthContext;