/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";

interface messageBodyModel {
  author: string;
  message: string;
  time: string;
  room: string;
}

function Chat({
  socket,
  username,
  room,
  close,
}: {
  socket: Socket;
  username: string;
  room: string;
  close: () => void;
}) {
  const [currentMessage, setCurrentMessage] = useState<string>();
  const [messageList, setMessageList] = useState<messageBodyModel[]>([]);

  const sendMessage = async () => {
    if (currentMessage) {
      const messageData = {
        room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((prev) => [...prev, messageData]);
      setCurrentMessage("");
    }
  };

  // recieving messages (get messages form the author (sender))
  useEffect(() => {
    socket.on("receive_message", (data: messageBodyModel) => {
      console.log(data);

      data.room === room && setMessageList((prev) => [...prev, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Hey..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button onClick={sendMessage}> &#9658;</button>
      </div>
      <button onClick={close}>exist</button>
    </div>
  );
}
export default Chat;
