import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.session.userId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

interface SignUpBody {
    username?: string,
    email?: string,
    password?: string,
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    // console.log(req.body);
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;
    // console.log(username,email,passwordRaw)
    try {
        if (!username || !email || !passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        const existingUsername = await UserModel.findOne({ username: username }).exec();

        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed,
        });

        // console.log(newUser._id)
        req.session.userId = newUser._id;
        req.session.email = newUser.email;
        res.status(201).json({userId:newUser._id,user:newUser});
    } catch (error) {
        next(error);
    }
};

interface LoginBody {
    email?:string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        if (!email || !password) {
            throw createHttpError(400, "Parameters missing");
        }
        const user = await UserModel.findOne({ email }).select("+password +username +email").exec();

        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid credentials");
        }

        req.session.userId = user._id;
        req.session.email = user.email;
        // console.log("**************",user)
        res.status(201).json({userId:user._id,user:user});
    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.clearCookie('connect.sid', { path: '/' });
            res.sendStatus(200);
        }
    });
};