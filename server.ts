import { createServer } from "node:http";
import next, { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let timerValue: number = 0; // Starting value for the timer
let aviator: number = 1.00; // Starting value for aviator
const incrementStep: number = 0.01; // Step for increment
let upperRange: number = Math.random() * (2 - 1) + 1; // Random maximum limit between 1 and 2

console.log(`Random Maximum Limit: ${upperRange.toFixed(2)}`);

// Function to start the timer
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

// Function to start incrementing the aviator
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

// Prepare Next.js app
app.prepare().then(() => {
  const httpServer: HTTPServer = createServer(handler);

  // Initialize Socket.IO
  const io = new IOServer(httpServer);

  io.on("connection", (socket: Socket) => {
    console.log("A user connected");

    // Send current timer and aviator values only once to the newly connected client
    socket.emit("initialValues", { timerValue, aviator });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  // Start the timer when the server starts
  startTimer(io);

  // Start the HTTP server
  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
