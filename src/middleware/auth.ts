import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

const auth = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(500).json({
                message: "Unauthorized access!"
            })
        }

        const decoded = jwt.verify(token, config.jwt_secret as string);
        console.log(decoded);
        
        
        next()
    }
};

export default auth;