import mongoose, { Document, Schema } from "mongoose";

export interface chat {
    members: Array<string>;
}
export interface chatmodel extends chat, Document { };

const Chat: Schema = new Schema(
    {
        members: Array,
    },
    { timestamps: true }
);
export default mongoose.model<chatmodel>('chat', Chat);