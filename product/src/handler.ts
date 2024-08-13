import { NextFunction, Request, Response } from "express";
import { DEFAULT_INTERNAL_ERROR, ErrorResponse } from "./response";

export function handleNotFound(req: Request, res: Response, _next: NextFunction): Response | void {
    if (!res.headersSent) {
        return res.status(404).json({
            success: false,
            code: "Not Found",
            message: `Not Found path ${req.originalUrl}`,
        });
    }
}

export function handleRequest(req: Request, res: Response, next: NextFunction): void {
    const start = performance.now();
    const { method, originalUrl } = req;
    res.on("finish", () => {
        const { statusCode } = res;
        const end = performance.now();
        console.log(`${method} ${originalUrl} ${statusCode} ${Math.round(end - start)}ms`);
    });
    next();
}

export function handleError(err: Error, _req: Request, res: Response, _next: NextFunction): Response {
    if (err instanceof ErrorResponse) {
        const response = err.getError();
        return res.status(response.status).json({
            success: response.success,
            code: response.code,
            message: response.message,
            data: response.data,
        });
    }

    return res.status(DEFAULT_INTERNAL_ERROR.status).json({
        success: DEFAULT_INTERNAL_ERROR.success,
        code: DEFAULT_INTERNAL_ERROR.code,
        message: DEFAULT_INTERNAL_ERROR.message,
    });
}
