import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Box, Typography, IconButton, TextField, Button, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ChatMessage {
  auctionId: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface AuctionChatProps {
  auctionId: string;
  username: string;
  open: boolean;
  onClose: () => void;
}

const socket: Socket = io("http://localhost:3001");

export const AuctionChat: React.FC<AuctionChatProps> = ({
  auctionId,
  username,
  open,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    socket.emit("JOIN_AUCTION_CHAT", auctionId);

    socket.on("CHAT_HISTORY", (history: ChatMessage[]) => {
      setMessages(history);
    });

    socket.on("RECEIVE_CHAT_MESSAGE", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("CHAT_HISTORY");
      socket.off("RECEIVE_CHAT_MESSAGE");
    };
  }, [auctionId, open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit("SEND_CHAT_MESSAGE", {
      auctionId,
      sender: username,
      content: input,
    });
    setInput("");
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        right: 0,
        top: 0,
        width: 350,
        height: "100vh",
        bgcolor: "#fff",
        borderLeft: "1px solid #ddd",
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
        boxShadow: 3,
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid #eee", bgcolor: "#f7f7f7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6">Chat de la Subasta</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {messages.map((msg, idx) => (
          <Box key={idx} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color={msg.sender === username ? "primary" : "text.secondary"}>
              {msg.sender}{" "}
              <Typography component="span" variant="caption" color="text.disabled">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Typography>
            </Typography>
            <Typography variant="body2">{msg.content}</Typography>
            <Divider sx={{ mt: 1 }} />
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box component="form" onSubmit={sendMessage} sx={{ display: "flex", p: 2, borderTop: "1px solid #eee" }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={e => setInput(e.target.value)}
          inputProps={{ maxLength: 200 }}
        />
        <Button type="submit" variant="contained" sx={{ ml: 1 }} disabled={!input.trim()}>
          Enviar
        </Button>
      </Box>
    </Box>
  );
};