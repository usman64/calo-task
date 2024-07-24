import { Request, Response } from 'express';

let clients: Response[] = [];

export const liveUpdatesHandler = (req: Request, res: Response): void => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  clients.push(res);

  req.on('close', (): void => {
    clients = clients.filter(client => client !== res);
  });
};

export const sendEvent = (data: string): void => {
  clients.forEach(client => client.write(`data: ${data}\n\n`));
};
