import { createMessageService } from '../services/messageService.js';
import {
  NEW_MSG_EVENT,
  NEW_MSG_RECIEVED_EVENT
} from '../utils/common/eventConstants.js';

export default function messageSocketHandlers(io, socket) {
  socket.on(NEW_MSG_EVENT, async function createMessageHandler(data, cb) {
    const { channelId } = data;
    const messageResponse = await createMessageService(data);
    // socket.broadcast.emit(NEW_MSG_RECIEVED_EVENT, messageResponse);
    io.to(channelId).emit(NEW_MSG_RECIEVED_EVENT, messageResponse);
    cb({
      success: true,
      message: 'Successfully created the message',
      data: messageResponse
    });
  });
}
