import { Request, Response } from 'express';

let clients: Response[] = [];

export const serverSideEventsHandler = (req: Request, res: Response): void => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    clients.push(res);

    req.on('close', (): void => {
      try {
        clients = clients.filter(client => client !== res);
      } catch (err) {
        console.error('Error during client disconnection:', err);
      }
    });

  } catch (err) {
    console.error('Error setting up server-side events handler:', err);
    res.status(500).end();
  }
};

export const sendEvent = (data: string): void => {
  try {
    clients.forEach((client, index) => {
      try {
        client.write(`data: ${data}\n\n`);
      } catch (err) {
        console.error('Error sending event to client:', err);
        // Remove the client from the list if there is an error
        clients.splice(index, 1);
      }
    });
  } catch (err) {
    console.error('Error in sendEvent function:', err);
  }
};
