import { JWTPayload } from "jose";

export interface SessionPlayload extends JWTPayload {
    userId: number;
    username: string;
    role: string;
    accessToken: string;
    expiresAt: number;
}
