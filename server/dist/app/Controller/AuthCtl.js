"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../Model/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, passWord, firstName, lastName, email, gender } = req.body;
        const newFullName = firstName + ' ' + lastName;
        let newUserName = userName.toLowerCase().replace(/ /g, '');
        const user_email = yield User_1.default.findOne({ email });
        if (user_email)
            return res.status(400).json({ msg: "This email already exists." });
        const user_name = yield User_1.default.findOne({ username: newUserName });
        if (user_name)
            return res.status(400).json({ msg: "This user name already exists." });
        if (passWord.length < 8)
            return res.status(400).json({ msg: "Password must be at least 8 characters." });
        const passwordHash = yield bcrypt_1.default.hash(passWord, 12);
        const newUser = new User_1.default({
            firstName, lastName, fullName: newFullName, userName: newUserName, email, passWord: passwordHash, gender
        });
        const user = yield newUser.save();
        const token = jsonwebtoken_1.default.sign({
            userName: user.userName, id: user._id
        }, "12345678", { expiresIn: '1h' });
        res.status(200).json({ user, token });
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = {
    register
};
