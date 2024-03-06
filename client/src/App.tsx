/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import "./App.css";
import Chat from "./components/chat/Chat";

const socket: Socket = io("http://localhost:3001");
// const socket: Socket = io("http://192.168.1.4:3001");

function App() {
  const [username, setUsername] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isRoomCreated, setIsRoomCreated] = useState<boolean>(false);

  // subscribe to a room
  const joinRoom = () => {
    if (username && room) {
      socket.emit("join_room", room, () => {
        setIsRoomCreated(true);
      });
    }
  };

  useEffect(() => {
    // In case connected
    socket.on("connect", () => {
      alert("connected successfully!");
      setIsConnected(true);
    });
  }, []);

  const existChat = () => {
    socket.emit("leave_room", room, () => {
      setIsRoomCreated(false);
      setUsername("");
      setRoom("");
    });
  };

  return (
    <div className="App">
      {!isRoomCreated ? (
        <div className="joinChatContainer">
          <h3>join a chat</h3>
          <input
            type="text"
            placeholder="jhon.."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />
          <input
            type="text"
            placeholder="room id"
            onChange={(e) => setRoom(e.target.value)}
          />
          <button disabled={!isConnected} onClick={joinRoom}>
            join room
          </button>
        </div>
      ) : (
        <Chat
          socket={socket}
          username={username}
          room={room}
          close={existChat}
        />
      )}
    </div>
  );
}

export default App;
