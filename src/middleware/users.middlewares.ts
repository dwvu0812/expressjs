import { NextFunction, Request, Response } from "express";
import { checkSchema } from "express-validator";

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    next()
}

export const registerValidator = checkSchema({
    email: {
        isEmail: {
            errorMessage: 'Invalid email format'
        },
        trim: true,
        normalizeEmail: true,
        custom: {
            options: (value) => {
                if (!value) {
                    throw new Error('Email is required');
                }
                return true;
            }
        }
    },
    password: {
        isLength: {
            errorMessage: 'Password must be 6-50 characters',
            options: { min: 6, max: 50 }
        },
        custom: {
            options: (value) => {
                if (!value) {
                    throw new Error('Password is required');
                }
                return true;
            }
        }
    },
    confirm_password: {
        custom: {
            options: (value, { req }) => {
                if (!value) {
                    throw new Error('Confirm password is required');
                }
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match');
                }
                return true;
            }
        }
    },
    name: {
        isLength: {
            errorMessage: 'Name must be 3-50 characters',
            options: { min: 3, max: 50 }
        },
        isString: {
            errorMessage: 'Name must be a string'
        },
        trim: true,
        escape: true
    },
    username: {
        isLength: {
            errorMessage: 'Username must be 3-30 characters',
            options: { min: 3, max: 30 }
        },
        matches: {
            options: /^[a-zA-Z0-9_]+$/,
            errorMessage: 'Username can only contain letters, numbers and underscore'
        },
        trim: true,
        escape: true
    }
})