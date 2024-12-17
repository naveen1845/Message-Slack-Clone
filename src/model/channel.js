import mongoose from 'mongoose';

const channelModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Channel name is required']
    }
  },
  { timestamps: true }
);

const Channel = mongoose.model('Channel', channelModel);

export default Channel;
