'use client'
import React, { useState } from 'react';
import { io } from 'socket.io-client';

const AviatorDisplay: React.FC = () => {
  const [timer,setTimmer] = useState(0);
  const [avaitor,setAvaitor] = useState(1.00)
  const socket = io("http://localhost:4000"); // Replace with your server URL

  socket.on("connect", () => {
      console.log("Connected to server");
      setTimmer(1);
      setAvaitor(1.99)
      // Send a test message
      socket.emit("input-change", { message: "Hello from client!" });
  });

// Listen for timer updates from the server
  socket.on("timerUpdate", (data:{ timerValue: number }) => {
      setTimmer(data.timerValue);
      console.log(timer)
      console.log("data :",data);
  });

  // Listen for aviator updates from the server
  socket.on("aviatorUpdate", (data) => {
      setAvaitor(data.aviator)
      
  });

  // Handle disconnection
  socket.on("disconnect", () => {
      console.log("Disconnected from server");
  });

  // Handle reconnection
  socket.on("reconnect", (attemptNumber) => {
      console.log(`Reconnected to server on attempt ${attemptNumber}`);
  });


  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h1>Aviator Game</h1>
      <h2>Timer: {timer}</h2>
      <h2>Aviator: {avaitor}</h2>
    </div>
  );
};

export default AviatorDisplay;