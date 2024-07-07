import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const requiresAuth: RequestHandler = (req, res, next) => {
    console.log("Session user id is:- ",req.params.userId)
    if (req.params.userId) {
        next();
    } else {
        next(createHttpError(401, "User not authenticated"));
    }
};