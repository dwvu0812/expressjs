import { NextFunction, Request, Response } from "express";

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    next()
}