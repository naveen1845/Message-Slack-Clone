import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    bode: {
        type: String,
        required: [true, 'Message Body is required']
    },
    image: {
        type: String
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender id is required']
    },
    channelId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: [true, 'Channel id is required']
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: [true, 'Workspace id is required']
    }

}, { timestamps : true});

const Message = mongoose.Collection('Message', messageModel);

export default Message;