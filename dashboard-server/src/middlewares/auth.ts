import { NextFunction, Request, Response } from "express";
import { SECRET_KEY } from "../util/env";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const headers = req.headers;
    const secret = headers['x-secret'];
    if(secret !== SECRET_KEY) {
        return res.status(401).json({success: false, msg: 'Secret is Invalid!'});
    }
    next();
}

export default authMiddleware;