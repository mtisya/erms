import jwt, {
    type Secret,
    type SignOptions,
    type JwtPayload
} from "jsonwebtoken";


const secret: Secret = process.env.JWT_SECRET as string;


const expiresIn: SignOptions["expiresIn"] =
    process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"] ?? "1h";


export function generateAccessToken(payload: object): string {

    return jwt.sign(
        payload,
        secret,
        {
            expiresIn
        }
    );

}


export function verifyAccessToken(token: string): string | JwtPayload {

    return jwt.verify(
        token,
        secret
    );

}