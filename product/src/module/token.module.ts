import axios, { AxiosError } from "axios";
import { config } from "../config";
import { Token } from "./dto.module";

class TokenModule {
    private readonly tokenHost = config.tokenHost;
    private readonly service = axios.create({
        baseURL: this.tokenHost,
    });

    generateToken = async (
        xid: string,
        email: string,
        audiance?: string
    ): Promise<{ accessToken: Token; refreshToken: Token } | null> => {
        try {
            const accessToken = await this.service.post<{
                accessToken: Token;
                refreshToken: Token;
            }>("/generate_token", {
                xid,
                email,
                audiance,
            });

            return accessToken.data;
        } catch (error) {
            console.log("[!] error while generate access token and refresh token. error:", error);
            return null;
        }
    };

    generateAccessToken = async (
        xid: string,
        email: string,
        audiance?: string
    ): Promise<{ accessToken: Token } | null> => {
        try {
            const accessToken = await this.service.post<{ accessToken: Token }>("/generate_ac", {
                xid,
                email,
                audiance,
            });

            return accessToken.data;
        } catch (error) {
            console.log("[!] error while generate access token. error:", error);
            return null;
        }
    };

    checkAccessToken = async (
        token: string,
        audiance?: string
    ): Promise<{ xid: string; email: string; audiance: string | null } | "unauthorize" | "forbidden" | null> => {
        try {
            const accessToken = await this.service.get<{ xid: string; email: string; audiance: string | null }>(
                "/check_at",
                {
                    params: {
                        token,
                        audiance,
                    },
                }
            );

            return accessToken.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                const statusCode = error.status;
                if (statusCode === 401) {
                    return "unauthorize";
                } else if (statusCode === 403) {
                    return "forbidden";
                }
            }
            console.log("[!] error while check access token. error:", error);
            return null;
        }
    };

    checkRefreshToken = async (
        token: string,
        audiance?: string
    ): Promise<{ xid: string } | "unauthorize" | "forbidden" | null> => {
        try {
            const refreshToken = await this.service.get<{ xid: string }>("/check_rt", {
                params: {
                    token,
                    audiance,
                },
            });

            return refreshToken.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                const statusCode = error.status;
                if (statusCode === 401) {
                    return "unauthorize";
                } else if (statusCode === 403) {
                    return "forbidden";
                }
            }
            console.log("[!] error while check access token. error:", error);
            return null;
        }
    };
}

export const tokenModule = new TokenModule();
