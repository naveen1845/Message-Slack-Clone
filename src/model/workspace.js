
import mongoose from "mongoose";

const workspaceModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Workspace name is required']
    },
    description: {
        type: String
    },
    joinId: {
        type: String,
        required: [true, 'Join code is required']
    },
    members: [
        {
            memberId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            role: {
                type: String,
                enum: ['admin', 'member'],
                default: 'member'
            }
        }
    ],
    Channels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel'
        }
    ]
}, { timestamps: true })


const Workspace = mongoose.Collection('Workspace', workspaceModel);

export default Workspace;