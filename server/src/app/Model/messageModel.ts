import mongoose, { Document, Schema } from "mongoose";

export interface message {
    conversation: string;
    sender: string;
    recipient: string;
    text: String;
    media: Array<string>;
    publicKey : Number
}
export interface messageModel extends message, Document { };

const Message: Schema = new Schema({
    conversation: { type: mongoose.Types.ObjectId, ref: 'Conversation' },
    sender: { type: mongoose.Types.ObjectId, ref: 'User' },
    recipient: { type: mongoose.Types.ObjectId, ref: 'User' },
    text:  String ,
    media: Array ,
    publicKey : Number,
},
    { timestamps: true }
);

export default mongoose.model<messageModel>('message', Message);

