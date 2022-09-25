import mongoose, { Document, Schema } from 'mongoose'

export interface user {
    userName: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    passWord: string;
    avatar: string;
    backgroundCover: string;
    role: string;
    gender: string
    address: string;
    story: string;
    friends: string
}
export interface userModel extends user, Document { };

const User: Schema = new Schema(
    {
        userName: {
            type: String, required: true,
            trim: true,
            maxlength: 25
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 10
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 10
        },
        fullName: {
            type: String
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        passWord: {
            type: String,
            require: true
        },
        avatar: {
            type: String,
            default: 'https://res.cloudinary.com/social-media-nw/image/upload/v1657458657/1656701295600defaultProfile_jodmye.jpg'
        },
        backgroundCover: {
            type: String,
            default: 'https://res.cloudinary.com/social-media-nw/image/upload/v1657980626/ttbvdff37vhrxo287jnr.jpg'
        },
        role: { type: String, default: 'User' },
        gender: { type: String, default: 'Male' },
        mobile: { type: String, default: '' },
        address: { type: String, default: '' },
        story: {
            type: String,
            default: '',
            maxlength: 200
        },
        friends: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
        friendsRequest: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
        friendsWaitToAccept: [{ type: mongoose.Types.ObjectId, ref: 'User' }]
    },
    { timestamps: true }
);

export default mongoose.model<userModel>('user', User);
