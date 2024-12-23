import { JOIN_CHANNEL_EVENT } from '../utils/common/eventConstants.js';

export default function channelSocketHandlers(io, socket) {
  socket.on(JOIN_CHANNEL_EVENT, async function (data, cb) {
    const roomId = data.channelId;
    socket.join(roomId);
    console.log(`user ${socket.id} joined the room ${roomId}`);
    cb({
      success: true,
      message: 'Successfully joined the channel',
      data: roomId
    });
  });
}
