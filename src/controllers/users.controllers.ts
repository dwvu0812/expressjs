import { Request, Response } from "express";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { UserVerifyStatus } from "~/models/schemas/User.schema";
import usersService from "~/services/users.services";
import { hashPassword } from "~/utils/crypto";

export const loginController = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Login success' });
}

export const registerController = async (req: Request, res: Response) => {
    const { email, password, name, username } = req.body;

    try {
        const existingEmail = await usersService.findUserByEmail(email);

        if (existingEmail) {
            return res.status(HTTP_STATUS.CONFLICT).json({
                message: 'Email already exists'
            })
        }

        const hashedPassword = await hashPassword(password);
        const user = await usersService.createUser({
            email,
            password: hashedPassword,
            name,
            username,
            verify: UserVerifyStatus.Unverified
        })

        return res.status(HTTP_STATUS.CREATED).json({
            message: 'User created successfully',
            data: {
                user: {
                    email: user.email,
                    name: user.name,
                    username: user.username
                }
            }
        })

    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Registration failed',
            error
        })
    }
}