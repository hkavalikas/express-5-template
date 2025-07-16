import { Request, Response } from 'express';
import { WebSocketService } from './WebSocketService';

export class WebSocketController {
  constructor(private webSocketService: WebSocketService) {}

  public getConnectedClients = (_req: Request, res: Response) => {
    const clients = this.webSocketService.getConnectedClients();
    res.json({
      clients,
      count: this.webSocketService.getClientCount(),
    });
  };

  public getStatus = (_req: Request, res: Response) => {
    res.json({
      status: 'WebSocket server is running',
      connectedClients: this.webSocketService.getClientCount(),
    });
  };
}
