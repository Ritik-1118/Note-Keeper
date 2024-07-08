import { RequestHandler } from "express";
import NoteModel from "../models/note";
import UserModel from "../models/user";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";


export const getNotes: RequestHandler = async (req, res, next) => {
    const UserId = req.params.userId;
    try {
        assertIsDefined(UserId);

        const notes = await NoteModel.find({ userId: UserId }).exec();
        console.log("All notes:- ",notes)
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};

export const getNoteById: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note");
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

export const searchByTitle: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.params.userId;
    const title = req.params.title;
    try {
        assertIsDefined(authenticatedUserId);

        const note = await NoteModel.findOne({ title, userId: authenticatedUserId }).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note");
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
}
interface CreateNoteBody {
    userId?:string,
    title?: string,
    label?: string,
    text?: string,
    backgroundColor?: string,
    textColor?: string,
}

export const createNote: RequestHandler< CreateNoteBody> = async (req, res, next) => {
    const authenticatedUserId = req.params.userId;
    const title = req.body.title;
    const label = req.body.label;
    const text = req.body.text;
    const backgroundColor = req.body.backgroundColor;
    const textColor = req.body.textColor;

    try {
        assertIsDefined(authenticatedUserId);

        if (!title) {
            throw createHttpError(400, "Note must have a title");
        }

        const newNote = await NoteModel.create({
            userId: authenticatedUserId,
            title: title,
            label: label,
            text: text,
            backgroundColor: backgroundColor,
            textColor: textColor,
        })
        const updateResult = await UserModel.findOneAndUpdate(
            { _id: authenticatedUserId, "labels.name": label },
            { $push: { "labels.$.noteIds": newNote._id } },
            { new: true, arrayFilters: [{ "label.name": label }] }
        );

        if (!updateResult) {
            // If label does not exist, add the label with the note ID
            await UserModel.findOneAndUpdate(
                { _id: authenticatedUserId },
                { $push: { labels: { name: label, noteIds: [newNote._id] } } },
                { new: true }
            );
        }

        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
};

interface UpdateNoteParams {
    userId: any,
    noteId: string | number,
}
interface UpdateNoteBody {
    title?: string,
    label?: string,
    text?: string,
    backgroundColor?: string,
    textColor?: string,
}
export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.params.userId;
    const noteId = req.params.noteId;
    const newTitle = req.body?.title;
    const newLabel = req.body?.label;
    const newText = req.body?.text;
    const newBackgroundColor = req.body?.backgroundColor;
    const newTextColor = req.body?.textColor;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note");
        }

        if(newTitle) note.title = newTitle;
        if(newLabel) note.label = newLabel;
        if(newText)note.text = newText;
        if(newBackgroundColor)note.backgroundColor = newBackgroundColor;
        if(newTextColor)note.textColor = newTextColor;

        const updatedNote = await note.save();

        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.params.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note");
        }

        await note.remove();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export const createLabel: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const lableName = req.body.lableName;
    try {
        // Find the user by userId
        const user = await UserModel.findById(authenticatedUserId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if the label already exists
        const existingLabelIndex = user.labels.findIndex(label => label.name === lableName);

        if (existingLabelIndex !== -1) {
            // Label already exists, update noteIds if needed
            return res.status(400).json({ message: 'Label already exists' });
        } else {
            // Label doesn't exist, create a new label object
            user.labels.push({ name: lableName, noteIds: [] });
        }
        await user.save();
        res.status(200).json({ message: 'Label added successfully', user });
    } catch (error) {
        next(error);
    }
}

export const createNoteInLabel: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.params.userId;
    const { title, labelName, text, backgroundColor, textColor } = req.body; // Assuming request body contains necessary fields

    try {
        // Find the user by userId
        const user = await UserModel.findById(authenticatedUserId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Create the note
        const newNote = await NoteModel.create({
            userId: authenticatedUserId,
            title,
            label: labelName,
            text,
            backgroundColor,
            textColor
        });
        const updateResult = await UserModel.findOneAndUpdate(
            { _id: authenticatedUserId, "labels.name": labelName },
            { $push: { "labels.$.noteIds": newNote._id } },
            { new: true, arrayFilters: [{ "label.name": labelName }] }
        );

        if (!updateResult) {
            // If label does not exist, add the label with the note ID
            await UserModel.findOneAndUpdate(
                { _id: authenticatedUserId },
                { $push: { labels: { name: labelName, noteIds: [newNote._id] } } },
                { new: true }
            );
        }
        console.log('User after saving:', updateResult);
        res.status(200).json({ message: 'Note created and added to label successfully', note: newNote });
    } catch (error) {
        next(error);
    }
};

export const getNotesByLabel: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.params.userId;
    const labelName = req.body.label; // Assuming labelName is part of the request parameters

    try {
        // Find the user by userId
        const user = await UserModel.findById(authenticatedUserId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the label in user's labels array
        const label = user.labels.find(label => label.name === labelName);

        if (!label) {
            return res.status(404).json({ message: 'Label not found' });
        }

        // Fetch notes based on noteIds in the label
        const notes = await NoteModel.find({ _id: { $in: label.noteIds } });

        res.status(200).json({ label, notes });
    } catch (error) {
        next(error);
    }
};

export const addLabelInNote: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const noteId = req.body.noteId;
    const label = req.body.label;
    // console.log("######################",noteId)
    try {
        // Find the user by userId
        const user = await UserModel.findById(authenticatedUserId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // console.log("######################",noteId)
        const updateResult = await UserModel.findOneAndUpdate(
            { _id: authenticatedUserId, "labels.name": label },
            { $addToSet: { "labels.$.noteIds": noteId } },
            { new: true}
        );

        if (!updateResult) {
            // If label does not exist, add the label with the note ID
            await UserModel.findOneAndUpdate(
                { _id: authenticatedUserId },
                { $push: { labels: { name: label, noteIds: [noteId] } } },
                { new: true }
            );
        }
        res.status(200).json({ message: 'label added successfully', note: updateResult });
    } catch (error) {
        next(error);
    }
}

export const getAllNotesByLabel: RequestHandler  = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await UserModel.findById(userId).select('labels');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const notesByLabels = [];
        for (const label of user.labels) {
            if (label.name) {  
                const notes = await NoteModel.find({ _id: { $in: label.noteIds }, label: label.name });
                notesByLabels.push({
                    labelName: label.name,
                    notes: notes
                });
            }
        }
        res.status(200).json(notesByLabels);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Server error' });
    }
};