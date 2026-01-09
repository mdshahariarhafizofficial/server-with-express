import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(500).json({
                    message: "Unauthorized access!"
                })
            }
    
            const decoded = jwt.verify(token, config.jwt_secret as string);
            req.user = decoded as JwtPayload;
            next()        
        } catch (error: any) {
            res.status(500).json({
                status: false,
                message: error.message
            })
        }
    }
};

export default auth;