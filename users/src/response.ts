export const DEFAULT_FORBIDDEN_ERROR: Responses = {
    success: false,
    status: 403,
    code: "E_AUTH",
    message: "Forbidden",
};

export const DEFAULT_UNAUTHORIZE_ERROR: Responses = {
    success: false,
    status: 401,
    code: "E_AUTH",
    message: "Unauthorize",
};

export const DEFAULT_INTERNAL_ERROR: Responses = {
    code: "E_ERR_0",
    status: 500,
    success: false,
    message: "interval server error",
};

export interface Responses {
    status: number;
    success: boolean;
    message: string;
    code: string;
    data?: unknown;
}

export interface RequestResponse {
    status: number;
    success: boolean;
    message: string;
}

export class ErrorResponse extends Error {
    private error!: Responses;
    constructor(err: Responses) {
        super(err.code);
        this.error = err;
    }

    getError(): Responses {
        return this.error;
    }
}

export class MapErrorResponse {
    private error: Map<string, ErrorResponse> = new Map();
    private readonly internalError = new ErrorResponse(DEFAULT_INTERNAL_ERROR);
    init() {
        let response: Record<string, RequestResponse> = {
            E_FOUND_1: {
                status: 404,
                success: false,
                message: "Recource Not Found",
            },
            E_AUTH_1: {
                status: 401,
                success: false,
                message: "Unauthorize",
            },
            E_AUTH_2: {
                status: 400,
                success: false,
                message: "password doesn't match",
            },
            E_AUTH_3: {
                status: 403,
                success: false,
                message: "Forbidden",
            },
            E_AUTH_4: {
                status: 400,
                success: false,
                message: "email already taken",
            },
            E_AUTH_5: {
                status: 429,
                success: false,
                message: "Email Login Attempts Exceeded Error",
            },
            E_ERR_1: {
                status: 400,
                success: false,
                message: "Failed while update recource",
            },
        };
        Object.entries(response).map(([key, value]) => {
            this.error.set(key, new ErrorResponse(Object.assign(value, { code: key })));
        });
        // clear response
        response = {};
    }

    getError(str: string): ErrorResponse {
        if (typeof str !== "string") {
            return this.internalError;
        }
        const response = this.error.get(str);

        return response || this.internalError;
    }

    badError(data: unknown): ErrorResponse {
        return new ErrorResponse({
            code: "E_REQ_0",
            status: 400,
            success: false,
            message: "bad request",
            data: data,
        });
    }
}

export const ERROR_UNAUTHORIZE: ErrorResponse = new ErrorResponse(DEFAULT_UNAUTHORIZE_ERROR);

export const ERROR_FORBIDDEN: ErrorResponse = new ErrorResponse(DEFAULT_FORBIDDEN_ERROR);

export const errorResponses: MapErrorResponse = new MapErrorResponse();
