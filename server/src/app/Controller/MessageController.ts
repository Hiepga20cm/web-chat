import messageModel from "../Model/messageModel";
import ConversationModel from "../Model/ConversationModel";
import { Request, Response } from "express";

const createMessage = async (req: Request, res: Response) => {
    try {
        const { sender, recipient, text, media, call } = req.body
        if (!recipient || (!text.trim() && media.length === 0 && !call)) return;

        const newConversation = await ConversationModel.findOneAndUpdate({
            $or: [
                { recipients: [sender, recipient] },
                { recipients: [recipient, sender] }
            ]
        }, {
            recipients: [sender, recipient],
            text,
            media,
            call,
            recipient: recipient,
            sender: sender
        }, { new: true, upsert: true })

        const newMessage = new messageModel({
            conversation: newConversation._id,
            sender,
            call,
            recipient,
            text,
            media
        })

        await newMessage.save()

        res.json({ msg: 'Create Success!' })

    } catch (error) {
        console.log(error);
    }
}
const getConversations = async (req: Request, res: Response) => {

    try {
        const id = req.params.id;
        console.log(id);
        if (id) {
            const conversations: any = await ConversationModel.find({
                recipients: { $in: [id] }
            });
            if (conversations) {
                res.status(200).json(conversations);

            } else {
                res.status(404).json('not found');
            }
        }

    } catch (error) {
        console.log(error);
    }
}

const getMessages = async (req: Request, res: Response) => {
    try {
        const conversationId = req.params.id;
        console.log(conversationId);
        console.log('asdasd');
        const messages = await messageModel.find({ conversation: conversationId });
        if (messages) {
            console.log(messages);
            res.status(200).json(messages);
        } else {
            res.status(404).json('notfound');
        }

    } catch (error) {
        console.log(error);
    }
}
const addMessage = async (req: Request, res: Response) => {
    try {
        const { conversation, sender, text, recipient } = req.body;
        console.log(req.body);
        const newMessage = new messageModel({
            conversation: conversation,
            sender: sender,
            recipient: recipient,
            text: text,

        })

        const result = await newMessage.save();

        res.status(200).json(result);


    } catch (error) {
        console.log(error);
    }
}

export default {
    createMessage,
    getConversations,
    getMessages,
    addMessage

}