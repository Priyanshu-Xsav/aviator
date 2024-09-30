'use client'
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;

const TimerComponent = () => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Connect to the Socket.IO server
    socket = io({
      path: '/api/timing',
    });

    // Listen for the timer event
    socket.on('timer', (serverTimer: number) => {
      setTimer(serverTimer);
    });

    // Cleanup on component unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <div>
      <h1>Game Timer</h1>
      <h2>{timer} seconds</h2>
    </div>
  );
};

export default TimerComponent;
