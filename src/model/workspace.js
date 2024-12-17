import mongoose from 'mongoose';

const workspaceModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      unique: true
    },
    description: {
      type: String
    },
    joinId: {
      type: String
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
    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
      }
    ]
  },
  { timestamps: true }
);

const Workspace = mongoose.model('Workspace', workspaceModel);

export default Workspace;
