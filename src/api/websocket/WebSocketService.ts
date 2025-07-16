import { WebSocket, WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const ClientSchema = z.object({
  id: z.string().uuid(),
  ws: z.instanceof(WebSocket),
  isAlive: z.boolean(),
});

export const MessageSchema = z.object({
  type: z.enum(['message', 'join', 'leave', 'ping', 'pong']),
  from: z.string().optional(),
  to: z.string().uuid().optional(),
  content: z.string().optional(),
  timestamp: z.number().int().positive(),
});

export type Client = z.infer<typeof ClientSchema>;
export type Message = z.infer<typeof MessageSchema>;

export class WebSocketService {
  private clients: Map<string, Client> = new Map();
  private wss: WebSocketServer;

  constructor(wss: WebSocketServer) {
    this.wss = wss;
    this.setupWebSocketServer();
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = uuidv4();
      const client: Client = {
        id: clientId,
        ws,
        isAlive: true,
      };

      this.clients.set(clientId, client);
      console.log(`Client ${clientId} connected`);

      // Send connection confirmation
      this.sendMessage(client, {
        type: 'join',
        from: 'server',
        content: `Connected with ID: ${clientId}`,
        timestamp: Date.now(),
      });

      ws.on('message', (data: Buffer) => {
        try {
          const rawMessage = JSON.parse(data.toString());
          const message = MessageSchema.parse(rawMessage);
          this.handleMessage(clientId, message);
        } catch (error) {
          console.error('Invalid message format:', error);
          this.sendMessage(client, {
            type: 'message',
            from: 'server',
            content: 'Invalid message format',
            timestamp: Date.now(),
          });
        }
      });

      ws.on('pong', () => {
        if (this.clients.has(clientId)) {
          this.clients.get(clientId)!.isAlive = true;
        }
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
        console.log(`Client ${clientId} disconnected`);
      });
    });

    // Heartbeat to detect broken connections
    global.setInterval(() => {
      this.wss.clients.forEach((ws) => {
        const client = Array.from(this.clients.values()).find(
          (c) => c.ws === ws
        );
        if (client) {
          if (!client.isAlive) {
            this.clients.delete(client.id);
            ws.terminate();
            return;
          }
          client.isAlive = false;
          ws.ping();
        }
      });
    }, 30000);
  }

  private handleMessage(senderId: string, message: Message): void {
    const sender = this.clients.get(senderId);
    if (!sender) return;

    switch (message.type) {
      case 'message':
        if (message.to && this.clients.has(message.to)) {
          // Direct message to specific client
          const recipient = this.clients.get(message.to)!;
          this.sendMessage(recipient, {
            ...message,
            from: senderId,
            timestamp: Date.now(),
          });
        } else {
          // Broadcast to all other clients
          this.broadcast(senderId, {
            ...message,
            from: senderId,
            timestamp: Date.now(),
          });
        }
        break;

      case 'ping':
        this.sendMessage(sender, {
          type: 'pong',
          from: 'server',
          timestamp: Date.now(),
        });
        break;

      default:
        console.log(`Unknown message type: ${message.type}`);
    }
  }

  private sendMessage(client: Client, message: Message): void {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  private broadcast(senderId: string, message: Message): void {
    this.clients.forEach((client, clientId) => {
      if (clientId !== senderId && client.ws.readyState === WebSocket.OPEN) {
        this.sendMessage(client, message);
      }
    });
  }

  public getConnectedClients(): string[] {
    return Array.from(this.clients.keys());
  }

  public getClientCount(): number {
    return this.clients.size;
  }
}
