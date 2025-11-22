import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FeedGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('🔗 Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('🔌 Client disconnected:', client.id);
  }

  @OnEvent('dispense')
  handleOrderCreatedEvent() {
    this.server.emit('dispense', {});
  }
}
