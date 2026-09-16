import jwt, {
    type Secret,
    type SignOptions,
    type JwtPayload
} from "jsonwebtoken";


const JWT_SECRET: Secret =
    process.env.JWT_SECRET || "development-secret";


const JWT_EXPIRES_IN: SignOptions["expiresIn"] = "1h";


export function generateAccessToken(
    payload: object
): string {

    return jwt.sign(
        payload,
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES_IN
        }
    );

}


export function verifyAccessToken(
    token: string
): string | JwtPayload {

    return jwt.verify(
        token,
        JWT_SECRET
    );

}