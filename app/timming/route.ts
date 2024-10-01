import type { Server as HTTPServer } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Socket as NetSocket } from 'net';
import { Server as IOServer } from 'socket.io'; // Importing as a value

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

let timerValue: number = 0; // Starting value for the timer
let aviator: number = 1.00; // Starting value for aviator
const incrementStep: number = 0.01; // Step for increment
let upperRange: number = Math.random() * (2 - 1) + 1; // Random maximum limit between 1 and 2

// Timer functions
const startTimer = (io: IOServer) => {
  const timerIntervalId = setInterval(() => {
    timerValue += 1;

    // Broadcast the timer value to all connected clients
    io.emit("timerUpdate", { timerValue, aviator });

    if (timerValue === 10) {
      clearInterval(timerIntervalId);
      startIncrementing(io);
    }
  }, 1000); // Update timer every second
};

const startIncrementing = (io: IOServer) => {
  console.log("Starting to increment aviator...");
  const incrementIntervalId = setInterval(() => {
    aviator += incrementStep;

    // Broadcast the aviator value to all connected clients
    io.emit("aviatorUpdate", { aviator });

    console.log(`Aviator Value: ${aviator.toFixed(2)}`);

    // Check if the aviator value has reached or exceeded the upper range
    if (aviator >= upperRange) {
      clearInterval(incrementIntervalId);
      console.log(`Reached the maximum limit of ${upperRange.toFixed(2)} for aviator.`);

      // Reset timer and aviator for the next cycle
      timerValue = 0;
      aviator = 1.00;
      upperRange = Math.random() * (2 - 1) + 1;
      console.log(`New Random Maximum Limit: ${upperRange.toFixed(2)}`);

      // Restart the timer
      startTimer(io);
    }
  }, 100); // Increment aviator every 100ms
};

export const GET = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log('Socket is already running.');
  } else {
    console.log('Socket is initializing...');

    const io = new IOServer(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log("A user connected");

      // Send current timer and aviator values to the newly connected client
      socket.emit("initialValues", { timerValue, aviator });

      socket.on('input-change', (msg) => {
        socket.broadcast.emit('update-input', msg);
      });

      socket.on('disconnect', () => {
        console.log("A user disconnected");
      });
    });

    // Start the timer functions when the server starts
    startTimer(io);
  }

  res.end();
};
