"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
;
const User = new mongoose_1.Schema({
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
    friends: [{ type: mongoose_1.default.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
exports.default = mongoose_1.default.model('user', User);
