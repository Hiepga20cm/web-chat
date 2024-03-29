import User from "../Model/User";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
//import multer from "multer";
import fs from "fs";
import ImageSchema from "../Model/ImageSchema";
import upload from "../MulterConfig/MulterConfig";
import mongoose from "mongoose";

const register = async (req: Request, res: Response) => {
  try {
    const { userName, passWord, firstName, lastName, email, gender } = req.body;
    const newFullName = firstName + " " + lastName;
    let newUserName = userName.toLowerCase().replace(/ /g, "");

    const user_email = await User.findOne({ email });
    if (user_email)
      return res.status(400).json({ msg: "This email already exists." });

    const user_name = await User.findOne({ userName: newUserName });
    if (user_name)
      return res.status(400).json({ msg: "This user name already exists." });

    if (passWord.length < 8)
      return res
        .status(400)
        .json({ msg: "Password must be at least 8 characters." });

    const passwordHash = await bcrypt.hash(passWord, 12);
    const newUser = new User({
      firstName,
      lastName,
      fullName: newFullName,
      userName: newUserName,
      email,
      passWord: passwordHash,
      gender,
    });
    const user = await newUser.save();
    const token = jwt.sign(
      {
        userName: user.userName,
        id: user._id,
      },
      "12345678",
      { expiresIn: "1h" }
    );
    res.status(200).json({ status: "ok", user, token });
  } catch (error) {
    console.log(error);
  }
};
const login = async (req: Request, res: Response) => {
  try {
    const { userName, passWord } = req.body;
    const user: any = await User.findOne({ userName: userName });

    if (user) {
      const validity: boolean = await bcrypt.compare(passWord, user.passWord);
      if (!validity) {
        return res.json({ status: "wrong password" });
      } else {
        const token = jwt.sign(
          {
            _id: user._id,
            permission: user.role,
          },
          "12345678",
          {
            expiresIn: 1000000,
          }
        );
        return res.json({ status: "ok", user: token, permission: user.role });
      }
    } else {
      return res.json({ status: "user does not exists" });
    }
  } catch (err) {
    console.log(err);
  }
};
const findByEmail = async (req: Request, res: Response) => {
  //username

  try {
    console.log(req.params.userName);

    const userName = req.params.userName;
    console.log(userName);
    const user: any = await User.find({
      userName: { $regex: userName },
    }).select(
      "-passWord  -friendsRequest -friendsWaitToAccept -role -friends "
    );
    if (user) {
      res.json({ user });
    } else {
      return res.json({ status: "user does not exists" });
    }
  } catch (error) {
    console.log(error);
  }
};
const getUser = async (req: Request, res: Response) => {
  try {
    const token1: any = req.headers.authorization?.split(" ")[1];
    const token = <any>jwt.verify(token1, "12345678");

    const user: any = await User.findById(token._id).select(
      "-passWord -friendsRequest -friendsWaitToAccept -role -friends"
    );
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json("not found");
    }
  } catch (error) {
    console.log(error);
  }
};
const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-passWord -role ");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json("not found");
    }
  } catch (error) {
    console.log(error);
  }
};

const friendRequest = async (req: Request, res: Response) => {
  try {
    const token1: any = req.headers.authorization?.split(" ")[1];
    const token = <any>jwt.verify(token1, "12345678");
    const usercurrent: any = await User.findById(token._id);

    console.log(usercurrent);
    const user = await User.find({
      _id: req.params.id,
      friends: usercurrent._id,
    });
    if (user.length > 0)
      return res.status(500).json({ msg: "You have friended this user." });

    await User.findOneAndUpdate(
      { _id: usercurrent._id },
      {
        $push: { friendsRequest: req.params.id }, //
      },
      { new: true }
    );

    const newUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { friendsWaitToAccept: usercurrent._id },
      },
      { new: true }
    ).select("-passWord");

    res.json({ newUser });
  } catch (err) {
    return res.status(500).json(err);
  }
};
const acceptFriend = async (req: Request, res: Response) => {
  try {
    const token1: any = req.headers.authorization?.split(" ")[1];
    const token = <any>jwt.verify(token1, "12345678");
    const usercurrent: any = await User.findById(token._id);

    const newUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { friends: usercurrent._id },
        $pull: { friendsRequest: usercurrent._id },
      },
      { new: true }
    ).populate("friends", "-passWord");

    await User.findOneAndUpdate(
      { _id: usercurrent._id },
      {
        $push: { friends: req.params.id },
        $pull: { friendsWaitToAccept: req.params.id },
      },
      { new: true }
    );

    res.json({ newUser });
  } catch (err) {
    return res.status(500).json(err);
  }
};
const refuseFriend = async (req: Request, res: Response) => {
  try {
    const token1: any = req.headers.authorization?.split(" ")[1];
    const token = <any>jwt.verify(token1, "12345678");
    const usercurrent: any = await User.findById(token._id);

    const newUser = await User.findOneAndUpdate(
      { _id: usercurrent },
      {
        $pull: { friendsRequest: req.params.id },
      },
      { new: true }
    ).select("-passWord");

    await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { friendsWaitToAccept: req.params.id },
      },
      { new: true }
    );

    res.json({ newUser });
  } catch (err) {
    return res.status(500).json(err);
  }
};
const getAllFriend = async (req: Request, res: Response) => {
  try {
    const token1: any = req.headers.authorization?.split(" ")[1];
    const token = <any>jwt.verify(token1, "12345678");
    const usercurrent: any = await User.findById(token._id)
      .select("friends")
      .populate("friends", "avatar userName lastName");
    res.json(usercurrent);
  } catch (error) {
    console.log(error);
  }
};
const changePassword = async (req: Request, res: Response) => {
  try {
    const token1: any = req.headers.authorization?.split(" ")[1];
    const token = <any>jwt.verify(token1, "12345678");
    const user: any = await User.findById(token._id).select("passWord");
    const { newPassword, oldPassword } = req.body;
    const validity: boolean = await bcrypt.compare(oldPassword, user.passWord);
    if (validity) {
      const change = await User.findByIdAndUpdate(token._id, {
        passWord: newPassword,
      });
      res.json(change + "success");
    }
  } catch (error) {
    console.log(error);
  }
};
const editProfile = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, story, address } = req.body;
    if (!firstName)
      return res.status(400).json({ msg: "Please add your first name." });
    if (!lastName)
      return res.status(400).json({ msg: "Please add your last name." });
    const token1: any = req.headers.authorization?.split(" ")[1];
    const token = <any>jwt.verify(token1, "12345678");
    const user: any = await User.findByIdAndUpdate(token._id, {
      firstName: firstName,
      lastName: lastName,
      story: story,
      address: address,
      fullName: firstName + " " + lastName,
    }).select("-passWord");
    res.json(user + "success");
  } catch (error) {
    console.log(error);
  }
};
export const addFile = async (req: Request, res: Response) => {
  // if (req.file) {
  //   const imgBase64 = req.file.buffer.toString("base64");
  //   const finalImg = {
  //     contentType: req.file.mimetype,
  //     fileName: req.file.originalname,
  //     file: imgBase64,
  //   };
  //   const type = finalImg.contentType.split("/");
  //   const id = new mongoose.Types.ObjectId();
  //   const file = new ImageSchema({
  //     _id: id,
  //     contentType: finalImg.contentType,
  //     fileName: `file-${id}.${type[1]}`,
  //     file: finalImg.file,
  //   });
  //   await file.save();
  //   return res.json(
  //     "successfuly" +
  //       {
  //         fileName: file.fileName,
  //         url: `attachment/${id}`,
  //       }
  //   );
  // }
};
const getFile = async (req: Request, res: Response) => {
  try {
    const file = await ImageSchema.findById(req.params.fileId);
    if (!file) throw null;
    else {
      const buff = Buffer.from(file.file, "base64");
      return res.status(200).contentType(file.contentType).send(buff);
    }
  } catch (error) {
    console.log(error);
  }
};
const cancelFriend = async (req: Request, res: Response) => {
  try {
    const token1: any = req.headers.authorization?.split(" ")[1];
    const token = <any>jwt.verify(token1, "12345678");
    const newUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { friendsWaitToAccept: token._id },
      },
      { new: true }
    ).select("-password");

    await User.findOneAndUpdate(
      { _id: token._id },
      {
        $pull: { friendsRequest: req.params.id },
      },
      { new: true }
    );

    res.json({ newUser });
  } catch (err) {
    return res.status(500).json({ err });
  }
};
export default {
  getFile,
  editProfile,
  changePassword,
  register,
  login,
  findByEmail,
  getUser,
  getUserById,
  friendRequest,
  acceptFriend,
  cancelFriend,
  refuseFriend,
  getAllFriend,
};
