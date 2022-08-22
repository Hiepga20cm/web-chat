import mongoose, { Document, Schema } from "mongoose";

export interface conversation {
    recipients: Array<string>;
    sender: string;
    recipient: string;
    text: string;
    media: Array<string>;
}
export interface conversationmodel extends conversation, Document { };

const Conversation: Schema = new Schema(
    {
        recipients: [{
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }],
        sender: String,
        recipient: String,
        text: String,
        media: Array,
    },
    { timestamps: true }
);
export default mongoose.model<conversationmodel>('conversation', Conversation);