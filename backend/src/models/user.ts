import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, select: false },
    password: { type: String, required: true, select: false },
    labels: [
        {
          name: String,   // Name of the label
          noteIds: [{ type: Schema.Types.ObjectId }]  // Array of note IDs associated with this label
        }
    ]
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);