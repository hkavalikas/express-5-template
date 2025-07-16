import { Router } from 'express';
import { WebSocketController } from './WebSocketController';
import { WebSocketService } from './WebSocketService';
import { wrapAsyncRoutes } from '../../common/middleware/errorHandler';

export function createWebSocketRoutes(
  webSocketService: WebSocketService
): Router {
  const router = wrapAsyncRoutes(Router());
  const webSocketController = new WebSocketController(webSocketService);

  router.get('/status', webSocketController.getStatus);
  router.get('/clients', webSocketController.getConnectedClients);

  return router;
}
